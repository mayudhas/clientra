import {
  DashboardIcon,
  UsersIcon,
  BriefcaseIcon,
  FileInvoiceIcon,
  BuildingIcon,
  UserCircleIcon,
  SettingsIcon,
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  roles?: string[];
}

const sidebarItem: menu[] = [
  // ─── MAIN ────────────────────────────────────────
  { header: 'Main' },
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    to: '/dashboard/default'
  },

  // ─── CRM ─────────────────────────────────────────
  { divider: true },
  { header: 'CRM' },
  {
    title: 'Clients',
    icon: UsersIcon,
    to: '/crm/clients'
  },
  {
    title: 'Projects',
    icon: BriefcaseIcon,
    to: '/crm/projects'
  },
  {
    title: 'Invoices',
    icon: FileInvoiceIcon,
    to: '/crm/invoices'
  },

  // ─── MANAGEMENT ──────────────────────────────────
  { divider: true, roles: ['super_admin', 'admin'] },
  { header: 'Management', roles: ['super_admin', 'admin'] },
  {
    title: 'Users',
    icon: UserCircleIcon,
    to: '/management/users',
    roles: ['super_admin', 'admin']
  },
  {
    title: 'Tenants',
    icon: BuildingIcon,
    to: '/management/tenants',
    roles: ['super_admin']
  },

  // ─── SETTINGS ────────────────────────────────────
  { divider: true },
  { header: 'Settings' },
  {
    title: 'Settings',
    icon: SettingsIcon,
    to: '/settings'
  }
];

export default sidebarItem;
