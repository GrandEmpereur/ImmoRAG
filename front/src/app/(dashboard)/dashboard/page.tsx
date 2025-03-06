"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Building2, Euro, Home, TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Sector, Label } from "recharts"
import { Area, AreaChart, CartesianGrid } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    ChartStyle,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const kpiData = [
    {
        title: "Biens en vente",
        value: "234",
        icon: Building2,
        trend: "+12.5%",
    },
    {
        title: "Prix moyen",
        value: "450 000 €",
        icon: Euro,
        trend: "+5.2%",
    },
    {
        title: "Visites",
        value: "1,234",
        icon: Users,
        trend: "+18.3%",
    },
    {
        title: "Ventes réalisées",
        value: "45",
        icon: Home,
        trend: "+8.1%",
    },
]

const priceData = [
    { month: "Jan", prix: 420000 },
    { month: "Fév", prix: 430000 },
    { month: "Mar", prix: 445000 },
    { month: "Avr", prix: 450000 },
    { month: "Mai", prix: 460000 },
    { month: "Juin", prix: 455000 },
]

const salesData = [
    { month: "Jan", ventes: 8, visites: 120 },
    { month: "Fév", ventes: 12, visites: 150 },
    { month: "Mar", ventes: 15, visites: 180 },
    { month: "Avr", ventes: 10, visites: 140 },
    { month: "Mai", ventes: 18, visites: 200 },
    { month: "Juin", ventes: 15, visites: 190 },
]

const chartData = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 290 },
    { date: "2024-04-06", desktop: 301, mobile: 340 },
    { date: "2024-04-07", desktop: 245, mobile: 180 },
    { date: "2024-04-08", desktop: 409, mobile: 320 },
    { date: "2024-04-09", desktop: 59, mobile: 110 },
    { date: "2024-04-10", desktop: 261, mobile: 190 },
    { date: "2024-04-11", desktop: 327, mobile: 350 },
    { date: "2024-04-12", desktop: 292, mobile: 210 },
    { date: "2024-04-13", desktop: 342, mobile: 380 },
    { date: "2024-04-14", desktop: 137, mobile: 220 },
    { date: "2024-04-15", desktop: 120, mobile: 170 },
    { date: "2024-04-16", desktop: 138, mobile: 190 },
    { date: "2024-04-17", desktop: 446, mobile: 360 },
    { date: "2024-04-18", desktop: 364, mobile: 410 },
    { date: "2024-04-19", desktop: 243, mobile: 180 },
    { date: "2024-04-20", desktop: 89, mobile: 150 },
    { date: "2024-04-21", desktop: 137, mobile: 200 },
    { date: "2024-04-22", desktop: 224, mobile: 170 },
    { date: "2024-04-23", desktop: 138, mobile: 230 },
    { date: "2024-04-24", desktop: 387, mobile: 290 },
    { date: "2024-04-25", desktop: 215, mobile: 250 },
    { date: "2024-04-26", desktop: 75, mobile: 130 },
    { date: "2024-04-27", desktop: 383, mobile: 420 },
    { date: "2024-04-28", desktop: 122, mobile: 180 },
    { date: "2024-04-29", desktop: 315, mobile: 240 },
    { date: "2024-04-30", desktop: 454, mobile: 380 },
    { date: "2024-05-01", desktop: 165, mobile: 220 },
    { date: "2024-05-02", desktop: 293, mobile: 310 },
    { date: "2024-05-03", desktop: 247, mobile: 190 },
    { date: "2024-05-04", desktop: 385, mobile: 420 },
    { date: "2024-05-05", desktop: 481, mobile: 390 },
    { date: "2024-05-06", desktop: 498, mobile: 520 },
    { date: "2024-05-07", desktop: 388, mobile: 300 },
    { date: "2024-05-08", desktop: 149, mobile: 210 },
    { date: "2024-05-09", desktop: 227, mobile: 180 },
    { date: "2024-05-10", desktop: 293, mobile: 330 },
    { date: "2024-05-11", desktop: 335, mobile: 270 },
    { date: "2024-05-12", desktop: 197, mobile: 240 },
    { date: "2024-05-13", desktop: 197, mobile: 160 },
    { date: "2024-05-14", desktop: 448, mobile: 490 },
    { date: "2024-05-15", desktop: 473, mobile: 380 },
    { date: "2024-05-16", desktop: 338, mobile: 400 },
    { date: "2024-05-17", desktop: 499, mobile: 420 },
    { date: "2024-05-18", desktop: 315, mobile: 350 },
    { date: "2024-05-19", desktop: 235, mobile: 180 },
    { date: "2024-05-20", desktop: 177, mobile: 230 },
    { date: "2024-05-21", desktop: 82, mobile: 140 },
    { date: "2024-05-22", desktop: 81, mobile: 120 },
    { date: "2024-05-23", desktop: 252, mobile: 290 },
    { date: "2024-05-24", desktop: 294, mobile: 220 },
    { date: "2024-05-25", desktop: 201, mobile: 250 },
    { date: "2024-05-26", desktop: 213, mobile: 170 },
    { date: "2024-05-27", desktop: 420, mobile: 460 },
    { date: "2024-05-28", desktop: 233, mobile: 190 },
    { date: "2024-05-29", desktop: 78, mobile: 130 },
    { date: "2024-05-30", desktop: 340, mobile: 280 },
    { date: "2024-05-31", desktop: 178, mobile: 230 },
    { date: "2024-06-01", desktop: 178, mobile: 200 },
    { date: "2024-06-02", desktop: 470, mobile: 410 },
    { date: "2024-06-03", desktop: 103, mobile: 160 },
    { date: "2024-06-04", desktop: 439, mobile: 380 },
    { date: "2024-06-05", desktop: 88, mobile: 140 },
    { date: "2024-06-06", desktop: 294, mobile: 250 },
    { date: "2024-06-07", desktop: 323, mobile: 370 },
]

const chartConfig = {
    visitors: {
        label: "Visiteurs",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const pieChartConfig = {
    Janvier: { label: "Janvier", color: "var(--color-1)" },
    Février: { label: "Février", color: "var(--color-2)" },
    Mars: { label: "Mars", color: "var(--color-3)" },
    Avril: { label: "Avril", color: "var(--color-4)" },
    Mai: { label: "Mai", color: "var(--color-5)" },
    Juin: { label: "Juin", color: "var(--color-6)" },
}

const desktopData = [
    { month: "Janvier", desktop: 420000 },
    { month: "Février", desktop: 430000 },
    { month: "Mars", desktop: 445000 },
    { month: "Avril", desktop: 450000 },
    { month: "Mai", desktop: 460000 },
    { month: "Juin", desktop: 455000 },
]

export default function Page() {
    const id = "pie-interactive"
    const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)

    const activeIndex = React.useMemo(
        () => desktopData.findIndex((item) => item.month === activeMonth),
        [activeMonth]
    )
    const months = React.useMemo(() => desktopData.map((item) => item.month), [])

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {kpi.title}
                            </CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <TrendingUp className="inline h-4 w-4 text-green-500" />
                                {kpi.trend} par rapport au mois dernier
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card data-chart={id}>
                    <ChartStyle id={id} config={pieChartConfig} />
                    <CardHeader className="flex-row items-start space-y-0 pb-0">
                        <div className="grid gap-1">
                            <CardTitle>Répartition des Prix</CardTitle>
                            <CardDescription>Janvier - Mai 2024</CardDescription>
                        </div>
                        <Select value={activeMonth} onValueChange={setActiveMonth}>
                            <SelectTrigger
                                className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                                aria-label="Sélectionner un mois"
                            >
                                <SelectValue placeholder="Choisir un mois" />
                            </SelectTrigger>
                            <SelectContent align="end" className="rounded-xl">
                                {months.map((key) => {
                                    const config = pieChartConfig[key as keyof typeof pieChartConfig]

                                    if (!config) {
                                        return null
                                    }

                                    return (
                                        <SelectItem
                                            key={key}
                                            value={key}
                                            className="rounded-lg [&_span]:flex"
                                        >
                                            <div className="flex items-center gap-2 text-xs">
                                                <span
                                                    className="flex h-3 w-3 shrink-0 rounded-sm"
                                                    style={{
                                                        backgroundColor: `var(--color-${key})`,
                                                    }}
                                                />
                                                {config?.label}
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="flex flex-1 justify-center pb-0">
                        <ChartContainer
                            id={id}
                            config={pieChartConfig}
                            className="mx-auto aspect-square w-full max-w-[300px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={desktopData}
                                    dataKey="desktop"
                                    nameKey="month"
                                    innerRadius={60}
                                    strokeWidth={5}
                                    activeIndex={activeIndex}
                                    activeShape={({
                                        outerRadius = 0,
                                        ...props
                                    }: PieSectorDataItem) => (
                                        <g>
                                            <Sector {...props} outerRadius={outerRadius + 10} />
                                            <Sector
                                                {...props}
                                                outerRadius={outerRadius + 25}
                                                innerRadius={outerRadius + 12}
                                            />
                                        </g>
                                    )}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {desktopData[activeIndex].desktop.toLocaleString()} €
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Prix moyen
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistiques de Visites</CardTitle>
                        <CardDescription>Janvier - Juin 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dashed" />}
                                />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Affichage des visiteurs totaux sur les 6 derniers mois
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Area Chart */}
            <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle>Visiteurs par Plateforme</CardTitle>
                        <CardDescription>
                            Répartition des visiteurs Desktop vs Mobile
                        </CardDescription>
                    </div>
                    <Select defaultValue="90d">
                        <SelectTrigger
                            className="w-[160px] rounded-lg sm:ml-auto"
                            aria-label="Sélectionner une période"
                        >
                            <SelectValue placeholder="3 derniers mois" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                3 derniers mois
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                30 derniers jours
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                7 derniers jours
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-desktop)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-desktop)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("fr-FR", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("fr-FR", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="mobile"
                                type="natural"
                                fill="url(#fillMobile)"
                                stroke="var(--color-mobile)"
                                stackId="a"
                            />
                            <Area
                                dataKey="desktop"
                                type="natural"
                                fill="url(#fillDesktop)"
                                stroke="var(--color-desktop)"
                                stackId="a"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}

