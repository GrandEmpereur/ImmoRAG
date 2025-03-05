"use client"

import {
    Home,
    Building2,
    Users2,
    BarChart3,
    Settings2,
    FileText,
    Mail,
    Calendar,
    Building,
    MapPin,
    Euro,
    type LucideIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-properties"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
    user: {
        name: "Jean Dupont",
        email: "j.dupont@immorag.fr",
        avatar: "/avatars/agent.jpg",
    },
    agencies: [
        {
            name: "ImmoRAG Paris",
            logo: Building2,
            plan: "Premium",
        },
        {
            name: "ImmoRAG Lyon",
            logo: Building2,
            plan: "Standard",
        },
        {
            name: "ImmoRAG Marseille",
            logo: Building2,
            plan: "Standard",
        },
    ],
    navMain: [
        {
            title: "Tableau de bord",
            icon: Home,
            variant: "default" as const,
            isActive: true,
            items: [
                {
                    title: "Vue d'ensemble",
                    url: "/dashboard/overview",
                },
                {
                    title: "Performance",
                    url: "/dashboard/performance",
                },
                {
                    title: "Statistiques",
                    url: "/dashboard/stats",
                },
            ],
        },
        {
            title: "Biens",
            icon: Building,
            variant: "default" as const,
            items: [
                {
                    title: "Liste des biens",
                    url: "/properties/list",
                },
                {
                    title: "Ajouter un bien",
                    url: "/properties/add",
                },
                {
                    title: "En attente",
                    url: "/properties/pending",
                },
            ],
        },
        {
            title: "Clients",
            icon: Users2,
            variant: "default" as const,
            items: [
                {
                    title: "Acheteurs",
                    url: "/clients/buyers",
                },
                {
                    title: "Vendeurs",
                    url: "/clients/sellers",
                },
                {
                    title: "Prospects",
                    url: "/clients/leads",
                },
            ],
        },
        {
            title: "Analyses",
            icon: BarChart3,
            variant: "default" as const,
            items: [
                {
                    title: "Marché",
                    url: "/analytics/market",
                },
                {
                    title: "Prix",
                    url: "/analytics/pricing",
                },
                {
                    title: "Tendances",
                    url: "/analytics/trends",
                },
            ],
        },
        {
            title: "Documents",
            icon: FileText,
            variant: "default" as const,
            items: [
                {
                    title: "Contrats",
                    url: "/documents/contracts",
                },
                {
                    title: "Mandats",
                    url: "/documents/mandates",
                },
                {
                    title: "Rapports",
                    url: "/documents/reports",
                },
            ],
        },
        {
            title: "Communication",
            icon: Mail,
            variant: "default" as const,
            items: [
                {
                    title: "Messages",
                    url: "/communication/messages",
                },
                {
                    title: "Emails",
                    url: "/communication/emails",
                },
                {
                    title: "Notifications",
                    url: "/communication/notifications",
                },
            ],
        },
        {
            title: "Paramètres",
            icon: Settings2,
            variant: "default" as const,
            items: [
                {
                    title: "Profil",
                    url: "/settings/profile",
                },
                {
                    title: "Agence",
                    url: "/settings/agency",
                },
                {
                    title: "Préférences",
                    url: "/settings/preferences",
                },
            ],
        },
    ],
    properties: [
        {
            name: "Appartement Luxe Paris 16",
            url: "/properties/paris-16",
            icon: Building,
            price: "1 250 000 €",
            status: "À vendre"
        },
        {
            name: "Villa Contemporaine Lyon",
            url: "/properties/lyon-villa",
            icon: Home,
            price: "850 000 €",
            status: "En négociation"
        },
        {
            name: "Local Commercial Marseille",
            url: "/properties/marseille-commercial",
            icon: Building2,
            price: "450 000 €",
            status: "À vendre"
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.agencies} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects properties={data.properties} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}



