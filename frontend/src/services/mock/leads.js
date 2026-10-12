import { hoursAgo, daysFromNow } from './helpers';

export const leadsSeed = [
  { id: 'LD-0001', company: 'Sunrise Soaps Pvt Ltd', contact: 'Anil Verma', phone: '+91 98000 11001', source: 'IndiaMART', products: 'Soap noodles', status: 'New', priority: 'High', assignedTo: 'Aarav Mehta', nextAction: 'Call to understand requirement', nextActionDate: daysFromNow(0), createdAt: hoursAgo(5) },
  { id: 'LD-0002', company: 'Lotus Home Care', contact: 'Meena Rao', phone: '+91 98000 11002', source: 'TradeIndia', products: 'Floor cleaner (private label)', status: 'Qualified', priority: 'Medium', assignedTo: 'Aarav Mehta', nextAction: 'Share sample and quotation', nextActionDate: daysFromNow(1), createdAt: hoursAgo(30) },
  { id: 'LD-0003', company: 'Pure Essence Traders', contact: 'Farhan Ali', phone: '+91 98000 11003', source: 'Website', products: 'Perfume compounds', status: 'Negotiation', priority: 'High', assignedTo: 'Aarav Mehta', nextAction: 'Revise price per kg', nextActionDate: daysFromNow(2), createdAt: hoursAgo(80) },
  { id: 'LD-0004', company: 'Green Leaf Retail', contact: 'Sonal Gupta', phone: '+91 98000 11004', source: 'Instagram', products: 'Hand wash 250 ml', status: 'Contacted', priority: 'Low', assignedTo: 'Aarav Mehta', nextAction: 'WhatsApp catalogue', nextActionDate: daysFromNow(0), createdAt: hoursAgo(120) },
  { id: 'LD-0005', company: 'Shiv Chemicals', contact: 'Deepak Soni', phone: '+91 98000 11005', source: 'Phone Calls', products: 'Colours and additives', status: 'On Hold', priority: 'Low', assignedTo: 'Aarav Mehta', nextAction: 'Revisit next month', nextActionDate: daysFromNow(20), createdAt: hoursAgo(300) },
  { id: 'LD-0006', company: 'Metro Wholesale Mart', contact: 'Raj Malhotra', phone: '+91 98000 11006', source: 'Justdial', products: 'Detergent powder', status: 'Converted', priority: 'Medium', assignedTo: 'Aarav Mehta', nextAction: 'Create PI', nextActionDate: daysFromNow(0), createdAt: hoursAgo(400) },
];
