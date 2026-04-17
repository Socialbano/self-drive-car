export interface Location {
  name: string;
  slug: string;
}

export interface LocationGroup {
  label: string;
  items: Location[];
}

export const LOCATION_GROUPS: LocationGroup[] = [
  {
    label: 'Popular Cities',
    items: [
      { name: 'Goa', slug: 'goa' },
      { name: 'Jaipur', slug: 'jaipur' },
      { name: 'Indore', slug: 'indore' },
    ],
  },
  {
    label: 'Areas',
    items: [
      { name: 'Vijay Nagar', slug: 'vijay-nagar' },
      { name: 'Bhanwar Kuan', slug: 'bhanwar-kuan' },
      { name: 'Airport', slug: 'airport' },
      { name: 'Ashok Nagar', slug: 'ashok-nagar' },
    ],
  },
];

export const ALL_LOCATIONS: Location[] = LOCATION_GROUPS.flatMap((g) => g.items);
