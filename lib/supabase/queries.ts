import { supabase } from './client';
import type { Car, FAQ, Testimonial, Lead } from '@/types';

// ======================================
// PUBLIC QUERIES — All data from Supabase only
// ======================================

/**
 * Get featured cars for HOMEPAGE
 */
export async function getFeaturedCars(): Promise<Car[]> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(6);

    
    if (error) throw error;
    return (data || []) as Car[];
  } catch (e) {
    console.error('Error in getFeaturedCars:', e);
    return [];
  }
}

/**
 * Get all ACTIVE cars for the public /cars fleet page
 */
export async function getCars(): Promise<Car[]> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

      
    if (error) throw error;
    return (data || []) as Car[];
  } catch (e) {
    console.error('Error in getCars:', e);
    return [];
  }
}

/**
 * Get ALL cars (active + inactive) for ADMIN panel only
 */
export async function getAllCarsAdmin(): Promise<Car[]> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

      
    if (error) throw error;
    return (data || []) as Car[];
  } catch (e) {
    console.error('Error in getAllCarsAdmin:', e);
    return [];
  }
}

/**
 * Get single car by slug for detail page
 */
export async function getCarBySlug(slug: string): Promise<Car | null> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
      
    if (error) throw error;
    return (data || null) as Car | null;
  } catch (e) {
    console.error('Error in getCarBySlug:', e);
    return null;
  }
}

/**
 * Get similar cars for the detail page sidebar
 */
export async function getSimilarCars(carType: string, excludeId: string): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('car_type', carType)
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(3);
    
  if (error) {
    console.error('Error fetching similar cars:', error);
    return [];
  }
  return (data || []) as Car[];
}

// ======================================
// OTHER PUBLIC QUERIES
// ======================================

export async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
  return (data || []) as FAQ[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return (data || []) as Testimonial[];
}

export async function insertLead(leadData: Partial<Lead>): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase
    .from('leads')
    .insert([
      {
        ...leadData,
        status: 'new',
        source: 'website_form',
      }
    ]);
    
  if (error) {
    console.error('Error inserting lead:', error);
    return { success: false, error };
  }
  return { success: true };
}

// ======================================
// ADMIN QUERIES
// ======================================

export async function getAdminLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  return (data || []) as Lead[];
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<boolean> {
  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
    
  if (error) {
    console.error(`Error updating lead ${id}:`, error);
    return false;
  }
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting lead ${id}:`, error);
    return false;
  }
  return true;
}

export async function upsertCar(carData: any, id?: string): Promise<{ success: boolean; error?: any }> {
  if (id && id !== '') {
    const { error } = await supabase
      .from('cars')
      .update(carData)
      .eq('id', id);
    if (error) {
      console.error('Error updating car:', error);
      return { success: false, error };
    }
  } else {
    // Make sure we drop empty 'id' if passing through forms
    const { id: _id, ...insertData } = carData;
    const { error } = await supabase
      .from('cars')
      .insert([insertData]);
    if (error) {
      console.error('Error inserting car:', error);
      return { success: false, error };
    }
  }
  return { success: true };
}

export async function deleteCar(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting car ${id}:`, error);
    return false;
  }
  return true;
}

export async function updateCarPricing(
  id: string,
  prices: Partial<{
    price_12hr: number;
    price_24hr: number;
  }>
): Promise<boolean> {
  const { error } = await supabase
    .from('cars')
    .update({ ...prices })
    .eq('id', id);
    
  if (error) {
    console.error(`Error updating car pricing ${id}:`, error);
    return false;
  }
  return true;
}

export async function bulkUpdatePricing(multiplier: number): Promise<{ success: boolean; updatedCount: number }> {
  const { data: cars, error: fetchErr } = await supabase
    .from('cars')
    .select('id, price_12hr, price_24hr, price_per_week, price_weekend, price_outstation')
    .eq('is_active', true);

  if (fetchErr || !cars) {
    console.error('Error fetching cars for bulk update:', fetchErr);
    return { success: false, updatedCount: 0 };
  }

  let updatedCount = 0;
  for (const car of cars) {
    const updates: any = {
      price_12hr: Math.round((car.price_12hr || 0) * multiplier),
      price_24hr: Math.round((car.price_24hr || 0) * multiplier),
    };
    // Only apply multiplier to optional fields if they have values
    if (car.price_per_week)   updates.price_per_week   = Math.round(car.price_per_week   * multiplier);
    if (car.price_weekend)    updates.price_weekend    = Math.round(car.price_weekend    * multiplier);
    if (car.price_outstation) updates.price_outstation = Math.round(car.price_outstation * multiplier);

    const { error } = await supabase.from('cars').update(updates).eq('id', car.id);
    if (!error) updatedCount++;
  }

  return { success: true, updatedCount };
}

export async function getAdminSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('key, value');

  if (error || !data) {
    console.error('Error fetching admin settings:', error);
    return {};
  }

  return data.reduce((acc: Record<string, string>, row: any) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function updateAdminSetting(key: string, value: string): Promise<boolean> {
  const { error } = await supabase
    .from('admin_settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
  return true;
}

export async function updateAdminSettings(settings: Record<string, string>): Promise<boolean> {
  const rows = Object.entries(settings).map(([key, value]) => ({ key, value: String(value) }));
  const { error } = await supabase
    .from('admin_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) {
    console.error('Error updating admin settings:', error);
    return false;
  }
  return true;
}

// ======================================
// BILLING & INVOICING QUERIES
// ======================================

export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
  return data || [];
}

export async function getInvoiceById(id: string) {
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !invoice) {
    console.error(`Error fetching invoice ${id}:`, error);
    return null;
  }
  
  if (invoice.car_id) {
    const { data: car } = await supabase.from('cars').select('*').eq('id', invoice.car_id).single();
    invoice.cars = car || null;
  }

  return invoice;
}

export async function createInvoice(invoiceData: any) {
  const { data, error } = await supabase
    .from('invoices')
    .insert([{...invoiceData, created_at: new Date().toISOString()}])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating invoice:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function updateInvoiceStatus(id: string, status: 'pending' | 'paid' | 'cancelled') {
  const { error } = await supabase
    .from('invoices')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
    
  if (error) {
    console.error(`Error updating invoice status ${id}:`, error);
    return false;
  }
  return true;
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    return { success: false, error };
  }
  return { success: true };
}

// ======================================
// AGREEMENT & CONTRACT QUERIES
// ======================================

export async function getAgreements() {
  const { data, error } = await supabase
    .from('agreements')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching agreements:', error);
    return [];
  }
  return data || [];
}

export async function getAgreementById(id: string) {
  const { data: agreement, error } = await supabase
    .from('agreements')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !agreement) {
    console.error(`Error fetching agreement ${id}:`, error);
    return null;
  }
  
  if (agreement.car_id) {
    const { data: car } = await supabase.from('cars').select('*').eq('id', agreement.car_id).single();
    agreement.cars = car || null;
  }

  return agreement;
}

export async function createAgreement(agreementData: any) {
  const { data, error } = await supabase
    .from('agreements')
    .insert([{...agreementData, created_at: new Date().toISOString()}])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating agreement:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function deleteAgreement(id: string) {
  const { error } = await supabase
    .from('agreements')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting agreement ${id}:`, error);
    return { success: false, error };
  }
  return { success: true };
}

export async function getActiveLocations(): Promise<any[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
    
  if (error) {
    console.error('Error fetching active locations:', error);
    return [];
  }
  return data || [];
}

export async function getBlogs(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*, locations(id, name, slug)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error in getBlogs:', err);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*, locations(id, name, slug)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data || null;
  } catch (err) {
    console.error(`Error in getBlogBySlug for ${slug}:`, err);
    return null;
  }
}

export async function getBlogsByLocation(locationId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*, locations(id, name, slug)')
      .or(`location_id.eq.${locationId},location_id.is.null`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error in getBlogsByLocation for ${locationId}:`, err);
    return [];
  }
}

export async function upsertBlog(blogData: any, id?: string): Promise<{ success: boolean; error?: any }> {
  try {
    if (id && id !== '') {
      const { error } = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', id);
      if (error) throw error;
    } else {
      const { id: _id, ...insertData } = blogData;
      const { error } = await supabase
        .from('blogs')
        .insert([insertData]);
      if (error) throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error in upsertBlog:', error);
    return { success: false, error };
  }
}

export async function deleteBlog(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error deleting blog ${id}:`, err);
    return false;
  }
}

// ======================================
// TESTIMONIALS ADMIN QUERIES
// ======================================

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Testimonial[];
  } catch (e) {
    console.error('Error in getAllTestimonialsAdmin:', e);
    return [];
  }
}

export async function upsertTestimonial(testimonialData: Partial<Testimonial>, id?: string): Promise<{ success: boolean; error?: any }> {
  try {
    if (id && id !== '') {
      const { error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', id);
      if (error) throw error;
    } else {
      const { id: _id, ...insertData } = testimonialData;
      const { error } = await supabase
        .from('testimonials')
        .insert([insertData]);
      if (error) throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error in upsertTestimonial:', error);
    return { success: false, error };
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error deleting testimonial ${id}:`, err);
    return false;
  }
}

