"use client";
import qs from "query-string";
import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export const Search = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onChange = (value: string) => {
    setValue(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) return;
    const url = qs.stringifyUrl({
      url: "/search",
      query: {
        term: value,
      },
    }, { skipEmptyString: true });
    router.push(url);
  };

  const onClear = () => {
    setValue("");
    const url = qs.stringifyUrl({
      url: "/",
      query: {
        term: "",
      },
    }, { skipEmptyString: true });
    router.push(url);
  };
  return (
    <form onSubmit={onSubmit} className="relative w-full lg:w-[400px] flex items-center">
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search" className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent"/>
      
      {value && (
        <Button type="button" size="sm" variant="ghost" className="absolute right-10 cursor-pointer hover:opacity-75 transition" onClick={onClear}>
          <X className="w-5 h-5 text-muted-foreground"/>
        </Button>
      )}
      <Button type="submit" size="sm" variant="ghost" className="rounded-l-none">
        <SearchIcon className="w-5 h-5 text-muted-foreground"/>
      </Button>
    </form>
  );
};
