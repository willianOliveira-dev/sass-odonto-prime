import { SidebarDashboard } from '../_components/_Sidebar';
import type React from 'react';

export default function DashboardLayout({
    children,
}: {
    children: Readonly<React.ReactNode>;
}) {
    return <SidebarDashboard>{children}</SidebarDashboard>;
}
