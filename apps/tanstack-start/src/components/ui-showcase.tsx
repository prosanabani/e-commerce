"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  BellIcon,
  CalendarIcon,
  InboxIcon,
  PlusIcon,
} from "lucide-react";
import { arSA, enUS } from "react-day-picker/locale";
import { useForm } from "react-hook-form";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";

import type { ChartConfig } from "@repo/ui/chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/alert-dialog";
import { AspectRatio } from "@repo/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/breadcrumb";
import { Button } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/button-group";
import { Calendar } from "@repo/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/carousel";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@repo/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/ui/hover-card";
import { Input } from "@repo/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/input-otp";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/item";
import { Kbd } from "@repo/ui/kbd";
import { Label } from "@repo/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@repo/ui/menubar";
import { NativeSelect, NativeSelectOption } from "@repo/ui/native-select";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@repo/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Progress } from "@repo/ui/progress";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/resizable";
import { ScrollArea } from "@repo/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Separator } from "@repo/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/sidebar";
import { Skeleton } from "@repo/ui/skeleton";
import { Slider } from "@repo/ui/slider";
import { Spinner } from "@repo/ui/spinner";
import { Switch } from "@repo/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Textarea } from "@repo/ui/textarea";
import { toast } from "@repo/ui/toast";
import { Toggle } from "@repo/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";

import { DataTableDemo } from "~/components/data-table-demo";
import { getLocale, localizeHref } from "~/paraglide/runtime";

const chartLabels = {
  en: {
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    desktop: "Desktop",
    mobile: "Mobile",
  },
  ar: {
    january: "يناير",
    february: "فبراير",
    march: "مارس",
    april: "أبريل",
    may: "مايو",
    june: "يونيو",
    desktop: "سطح المكتب",
    mobile: "الجوال",
  },
} as const;

function useSampleText() {
  const isRtl = getLocale() === "ar";
  return {
    isRtl,
    title: isRtl ? "معرض مكوّنات الواجهة" : "UI Component Showcase",
    subtitle: isRtl
      ? "اختبر جميع مكوّنات shadcn مع دعم RTL واللغات المتعددة"
      : "Test all shadcn components with RTL and multilingual support",
    label: isRtl ? "حقل نص" : "Text field",
    placeholder: isRtl ? "اكتب هنا..." : "Type here...",
    button: isRtl ? "زر" : "Button",
    item1: isRtl ? "عنصر أول" : "First item",
    item2: isRtl ? "عنصر ثاني" : "Second item",
    fruits: isRtl ? ["تفاح", "موز", "برتقال"] : ["Apple", "Banana", "Orange"],
    description: isRtl
      ? "وصف تجريبي للتحقق من المحاذاة والخطوط في الوضع الأفقي المعكوس."
      : "Sample description to verify alignment and typography.",
    paginationPrevious: isRtl ? "السابق" : "Previous",
    paginationNext: isRtl ? "التالي" : "Next",
    home: isRtl ? "الرئيسية" : "Home",
    components: isRtl ? "المكونات" : "Components",
    breadcrumbCurrent: isRtl ? "مسار التنقل" : "Breadcrumb",
    sheet: isRtl ? "لوحة جانبية" : "Sheet",
  };
}

function Section({
  title,
  children,
  layout = "grid",
}: {
  title: string;
  children: React.ReactNode;
  layout?: "grid" | "block";
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {layout === "block" ? (
        <div className="bg-card overflow-hidden rounded-xl border">
          {children}
        </div>
      ) : (
        <div className="bg-card flex flex-wrap items-start gap-4 rounded-xl border p-6">
          {children}
        </div>
      )}
    </section>
  );
}

export function UiShowcase() {
  const t = useSampleText();
  const chartDir = t.isRtl ? "rtl" : "ltr";
  const chartLocale = t.isRtl ? chartLabels.ar : chartLabels.en;
  const chartData = React.useMemo(
    () =>
      (
        [
          { month: "january", desktop: 186, mobile: 80 },
          { month: "february", desktop: 305, mobile: 200 },
          { month: "march", desktop: 237, mobile: 120 },
          { month: "april", desktop: 73, mobile: 190 },
          { month: "may", desktop: 209, mobile: 130 },
          { month: "june", desktop: 214, mobile: 140 },
        ] as const
      ).map((row) => ({ ...row })),
    [],
  );
  const chartConfig = React.useMemo(
    () =>
      ({
        desktop: {
          label: chartLocale.desktop,
          color: "var(--chart-2)",
        },
        mobile: {
          label: chartLocale.mobile,
          color: "var(--chart-1)",
        },
      }) satisfies ChartConfig,
    [chartLocale.desktop, chartLocale.mobile],
  );
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [progress, setProgress] = React.useState(45);
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const formSchema = z.object({
    email: z.string().email(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  return (
    <main
      dir={chartDir}
      className="container space-y-12 py-12 pb-32"
    >
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground max-w-2xl">{t.subtitle}</p>
        <p className="text-muted-foreground text-sm">
          {t.isRtl
            ? "استخدم مبدّل اللغة في الأسفل للتبديل بين العربية والإنجليزية."
            : "Use the locale switcher at the bottom to toggle Arabic and English."}
        </p>
      </header>

      <Section title="Accordion">
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="1">
            <AccordionTrigger>{t.item1}</AccordionTrigger>
            <AccordionContent>{t.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>{t.item2}</AccordionTrigger>
            <AccordionContent>{t.description}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Alert">
        <Alert className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>{t.item1}</AlertTitle>
          <AlertDescription>{t.description}</AlertDescription>
        </Alert>
      </Section>

      <Section title="Alert Dialog">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">{t.button}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.item1}</AlertDialogTitle>
              <AlertDialogDescription>{t.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t.isRtl ? "إلغاء" : "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction>
                {t.isRtl ? "متابعة" : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      <Section title="Aspect Ratio">
        <div className="w-[200px]">
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
            <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
              16:9
            </div>
          </AspectRatio>
        </div>
      </Section>

      <Section title="Avatar & Badge">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="" />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
        <Badge>{t.button}</Badge>
        <Badge variant="secondary">{t.item2}</Badge>
      </Section>

      <Section title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={localizeHref("/")}>
                {t.home}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={localizeHref("/ui-showcase")}>
                {t.components}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t.breadcrumbCurrent}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section title="Button & Button Group">
        <Button>{t.button}</Button>
        <Button variant="secondary">{t.item2}</Button>
        <Button variant="outline">{t.item1}</Button>
        <ButtonGroup>
          <Button variant="outline">{t.item1}</Button>
          <Button variant="outline">{t.item2}</Button>
        </ButtonGroup>
      </Section>

      <Section title="Calendar">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={t.isRtl ? arSA : enUS}
          dir={t.isRtl ? "rtl" : "ltr"}
          className="rounded-md border"
        />
      </Section>

      <Section title="Card">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{t.item1}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder={t.placeholder} />
          </CardContent>
          <CardFooter>
            <Button className="w-full">{t.button}</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Carousel">
        <Carousel
          className="mx-auto w-full max-w-xs"
          opts={{ direction: chartDir }}
        >
          <CarouselContent>
            {[1, 2, 3].map((n) => (
              <CarouselItem key={n}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{n}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>

      <Section title="Chart">
        <ChartContainer
          config={chartConfig}
          dir={chartDir}
          className="min-h-[200px] w-full max-w-lg"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid
              vertical={false}
              orientation={chartDir === "rtl" ? "right" : "left"}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              reversed={chartDir === "rtl"}
              tickFormatter={(value) =>
                chartLocale[value as keyof typeof chartLocale].slice(0, 3)
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    chartLocale[value as keyof typeof chartLocale]
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Section>

      <Section title="Checkbox, Radio, Switch">
        <div className="flex items-center gap-2">
          <Checkbox id="cb" />
          <Label htmlFor="cb">{t.label}</Label>
        </div>
        <RadioGroup defaultValue="a" className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="a" id="r1" />
            <Label htmlFor="r1">{t.item1}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="b" id="r2" />
            <Label htmlFor="r2">{t.item2}</Label>
          </div>
        </RadioGroup>
        <div className="flex items-center gap-2">
          <Switch id="sw" />
          <Label htmlFor="sw">{t.label}</Label>
        </div>
      </Section>

      <Section title="Collapsible">
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {collapsibleOpen
                ? t.isRtl
                  ? "إخفاء"
                  : "Hide"
                : t.isRtl
                  ? "إظهار"
                  : "Show"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="text-muted-foreground mt-2 max-w-md text-sm">
            {t.description}
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section title="Combobox">
        <div className="w-full max-w-xs">
          <Combobox items={t.fruits}>
            <ComboboxInput
              placeholder={t.isRtl ? "اختر فاكهة" : "Select fruit"}
              className="w-full"
            />
            <ComboboxContent>
              <ComboboxEmpty>
                {t.isRtl ? "لا نتائج" : "No results"}
              </ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </Section>

      <Section title="Command">
        <Command className="max-w-md rounded-lg border">
          <CommandInput placeholder={t.placeholder} />
          <CommandList>
            <CommandEmpty>{t.isRtl ? "لا نتائج" : "No results"}</CommandEmpty>
            <CommandGroup heading={t.isRtl ? "إجراءات" : "Actions"}>
              <CommandItem>{t.item1}</CommandItem>
              <CommandItem>{t.item2}</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Section>

      <Section title="Context Menu">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[120px] w-[200px] items-center justify-center rounded-md border border-dashed text-sm">
            {t.isRtl ? "انقر بالزر الأيمن" : "Right click"}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>{t.item1}</ContextMenuItem>
            <ContextMenuItem>{t.item2}</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Section>

      <Section title="Dialog & Drawer & Sheet">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.item1}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t.item1}</DrawerTitle>
              <DrawerDescription>{t.description}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button className="w-full">{t.button}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">{t.sheet}</Button>
          </SheetTrigger>
          <SheetContent side={t.isRtl ? "left" : "right"}>
            <SheetHeader>
              <SheetTitle>{t.item1}</SheetTitle>
              <SheetDescription>{t.description}</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title={t.isRtl ? "جدول البيانات" : "Data Table"}>
        <DataTableDemo isRtl={t.isRtl} />
      </Section>

      <Section title="Dropdown Menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{t.button}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{t.item1}</DropdownMenuItem>
            <DropdownMenuItem>{t.item2}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="Empty & Item">
        <Empty className="max-w-sm border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>{t.item1}</EmptyTitle>
            <EmptyDescription>{t.description}</EmptyDescription>
          </EmptyHeader>
        </Empty>
        <Item variant="outline" className="max-w-sm">
          <ItemMedia>
            <BellIcon className="size-4" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{t.item1}</ItemTitle>
            <ItemDescription>{t.description}</ItemDescription>
          </ItemContent>
        </Item>
      </Section>

      <Section title="Field & Form">
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel>{t.label}</FieldLabel>
            <Input placeholder={t.placeholder} />
            <FieldDescription>{t.description}</FieldDescription>
          </Field>
        </FieldGroup>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() =>
              toast.success(t.isRtl ? "تم الإرسال" : "Submitted"),
            )}
            className="max-w-sm space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t.button}</Button>
          </form>
        </Form>
      </Section>

      <Section title="Hover Card & Popover & Tooltip">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              {t.isRtl ? "مرر المؤشر" : "Hover me"}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">{t.description}</HoverCardContent>
        </HoverCard>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Popover</Button>
          </PopoverTrigger>
          <PopoverContent>{t.description}</PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent>{t.description}</TooltipContent>
        </Tooltip>
      </Section>

      <Section title="Input, Textarea, Input Group, OTP">
        <Input placeholder={t.placeholder} className="max-w-xs" />
        <Textarea placeholder={t.placeholder} className="max-w-xs" />
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder={t.placeholder} />
        </InputGroup>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Section>

      <Section title="Kbd">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Section>

      <Section title="Menubar & Navigation Menu">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>{t.isRtl ? "ملف" : "File"}</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>{t.item1}</MenubarItem>
              <MenubarItem>{t.item2}</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href={localizeHref("/")}>
                {t.isRtl ? "الرئيسية" : "Home"}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href={localizeHref("/ui-showcase")}>
                {t.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Section>

      <Section title="Native Select & Select">
        <NativeSelect className="max-w-xs">
          <NativeSelectOption value="1">{t.item1}</NativeSelectOption>
          <NativeSelectOption value="2">{t.item2}</NativeSelectOption>
        </NativeSelect>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{t.item1}</SelectItem>
            <SelectItem value="2">{t.item2}</SelectItem>
          </SelectContent>
        </Select>
      </Section>

      <Section title="Pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" text={t.paginationPrevious} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" text={t.paginationNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Section>

      <Section title="Progress & Slider & Spinner">
        <Progress value={progress} className="w-[200px]" />
        <Slider
          value={[progress]}
          onValueChange={(value) => setProgress(value[0] ?? 0)}
          max={100}
          step={1}
          className="w-[200px]"
        />
        <Spinner />
      </Section>

      <Section title="Resizable">
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[120px] max-w-md rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4 text-sm">
              {t.item1}
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4 text-sm">
              {t.item2}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Section>

      <Section title="Scroll Area">
        <ScrollArea className="h-24 w-48 rounded-md border p-4">
          <p className="text-sm">{t.description}</p>
          <p className="text-sm">{t.description}</p>
          <p className="text-sm">{t.description}</p>
        </ScrollArea>
      </Section>

      <Section title="Separator & Skeleton">
        <div className="flex w-full max-w-xs items-center gap-4">
          <span>{t.item1}</span>
          <Separator orientation="vertical" className="h-6" />
          <span>{t.item2}</span>
        </div>
        <Skeleton className="h-10 w-48" />
      </Section>

      <Section title="Sidebar" layout="block">
        <SidebarProvider
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          className="relative flex !min-h-0 h-[280px] w-full overflow-hidden"
        >
          <Sidebar
            collapsible="none"
            side={t.isRtl ? "right" : "left"}
            className={
              sidebarOpen
                ? t.isRtl
                  ? "shrink-0 border-s border-sidebar-border"
                  : "shrink-0 border-e border-sidebar-border"
                : "w-0 min-w-0 shrink-0 overflow-hidden border-0 p-0 opacity-0"
            }
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>
                  {t.isRtl ? "قائمة" : "Menu"}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <CalendarIcon />
                        <span>{t.item1}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <PlusIcon />
                        <span>{t.item2}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-row items-center gap-2 bg-background p-4">
            <SidebarTrigger />
            <span className="min-w-0 flex-1 text-sm">{t.description}</span>
          </div>
        </SidebarProvider>
      </Section>

      <Section title="Table & Tabs">
        <Tabs defaultValue="tab1" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="tab1">{t.item1}</TabsTrigger>
            <TabsTrigger value="tab2">{t.item2}</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">{t.description}</TabsContent>
          <TabsContent value="tab2">{t.description}</TabsContent>
        </Tabs>
        <Table className="max-w-md">
          <TableHeader>
            <TableRow>
              <TableHead>{t.isRtl ? "الاسم" : "Name"}</TableHead>
              <TableHead>{t.isRtl ? "الحالة" : "Status"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t.item1}</TableCell>
              <TableCell>
                <Badge>{t.button}</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title="Toast & Toggle">
        <Button
          variant="outline"
          onClick={() =>
            toast.success(t.isRtl ? "إشعار تجريبي" : "Sample notification")
          }
        >
          {t.isRtl ? "عرض إشعار" : "Show toast"}
        </Button>
        <Toggle aria-label="Toggle">{t.isRtl ? "تبديل" : "Toggle"}</Toggle>
        <ToggleGroup type="single" defaultValue="a">
          <ToggleGroupItem value="a">{t.item1}</ToggleGroupItem>
          <ToggleGroupItem value="b">{t.item2}</ToggleGroupItem>
        </ToggleGroup>
      </Section>
    </main>
  );
}
