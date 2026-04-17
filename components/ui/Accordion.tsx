'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  defaultExpanded?: string;
}

export function Accordion({ items, className, defaultExpanded }: AccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpanded || null);

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className={clsx('w-full divide-y divide-gray-200 border-t border-b border-gray-200', className)}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <div key={item.id} className="py-2">
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between py-4 text-left focus:outline-none"
            >
              <span className="font-heading font-medium text-primary text-lg">{item.title}</span>
              <ChevronDown
                className={clsx(
                  'h-5 w-5 text-gray-500 transition-transform duration-200',
                  isExpanded ? 'rotate-180' : ''
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto', marginBottom: 16 },
                    collapsed: { opacity: 0, height: 0, marginBottom: 0 }
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden text-gray-600"
                >
                  {item.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
