import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { useState } from "react";

const categories = [
  "Ecommerce",
  "Viral",
  "Funny", 
  "Pets",
  "Events",
  "Professional",
  "Real Estate",
  "Food",
  "Fashion",
  "Travel",
  "Education",
  "Health",
  "Fitness"
];

const eventSubcategories = [
  "Birthday",
  "Marriage", 
  "Graduation"
];

const professionalSubcategories = [
  "LinkedIn Profile",
  "CV",
  "Business Card"
];

interface TemplateFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export function TemplateFilters({ onFiltersChange }: TemplateFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    onFiltersChange({ categories: updated, search: searchQuery, sort: sortBy });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setSortBy("popular");
    onFiltersChange({ categories: [], search: "", sort: "popular" });
  };

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onFiltersChange({ categories: selectedCategories, search: e.target.value, sort: sortBy });
            }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value);
            onFiltersChange({ categories: selectedCategories, search: searchQuery, sort: value });
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                onClick={() => handleCategoryToggle(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent className="sm:block">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Categories</h3>
              <CollapsibleTrigger asChild className="sm:hidden">
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>

            {/* Event Subcategories */}
            {selectedCategories.includes("Events") && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Event Types</h4>
                <div className="grid grid-cols-3 gap-3">
                  {eventSubcategories.map((subcat) => (
                    <div key={subcat} className="flex items-center space-x-2">
                      <Checkbox
                        id={subcat}
                        checked={selectedCategories.includes(subcat)}
                        onCheckedChange={() => handleCategoryToggle(subcat)}
                      />
                      <label
                        htmlFor={subcat}
                        className="text-sm leading-none cursor-pointer"
                      >
                        {subcat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Subcategories */}
            {selectedCategories.includes("Professional") && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Professional Types</h4>
                <div className="grid grid-cols-3 gap-3">
                  {professionalSubcategories.map((subcat) => (
                    <div key={subcat} className="flex items-center space-x-2">
                      <Checkbox
                        id={subcat}
                        checked={selectedCategories.includes(subcat)}
                        onCheckedChange={() => handleCategoryToggle(subcat)}
                      />
                      <label
                        htmlFor={subcat}
                        className="text-sm leading-none cursor-pointer"
                      >
                        {subcat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}