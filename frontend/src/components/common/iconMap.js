import {
  LayoutDashboard, CheckSquare, Bell, Users, FileText, Handshake, ShoppingCart, Warehouse, Factory, Truck,
  Undo2, Wallet, Landmark, BarChart3, ShieldCheck, Clock, AlertTriangle, ClipboardList, Scale, Inbox,
  ScrollText, CircleDot,
} from 'lucide-react';

const ICONS = {
  LayoutDashboard, CheckSquare, Bell, Users, FileText, Handshake, ShoppingCart, Warehouse, Factory, Truck,
  Undo2, Wallet, Landmark, BarChart3, ShieldCheck, Clock, AlertTriangle, ClipboardList, Scale, Inbox, ScrollText,
};

export const getIcon = (name) => ICONS[name] || CircleDot;
