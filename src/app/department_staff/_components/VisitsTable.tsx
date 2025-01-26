"use client";

import { Input } from "@/components/ui/input";
import { Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function VisitsTable({
  visits,
}: {
  visits: Prisma.VisitGetPayload<{ include: { Beneficiary: true } }>[];
}) {
  const [filter, setFilter] = useState("");

  const filteredData = useMemo(() => {
    const lowercasedFilter = filter.toLowerCase();
    return visits.filter(
      (card) =>
        card.token.toLowerCase().includes(lowercasedFilter) ||
        card.Beneficiary.cnic.includes(lowercasedFilter) ||
        card.Beneficiary.name.toLowerCase().includes(lowercasedFilter),
    );
  }, [filter]);

  return (
    <div className="container mx-auto p-4">
      <div className="relative mb-6">
        <Input
          placeholder="Search by Token, CNIC, or Beneficiary Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-10"
          aria-label="Search cards"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          size={20}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((card) => (
          <Link href={`/department_staff/${card.id}`} key={card.id}>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{card.token}</span>
                  <Badge
                    variant={
                      card.status === "PENDING" ? "secondary" : "default"
                    }
                  >
                    {card.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-semibold">{card.Beneficiary.name}</p>
                <p className="text-sm text-muted-foreground">
                  CNIC: {card.Beneficiary.cnic}
                </p>
                <p className="mt-2">{card.purpose}</p>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Created: {new Date(card.createdAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      {filteredData.length === 0 && (
        <p className="mt-6 text-center text-muted-foreground">
          No results found.
        </p>
      )}
    </div>
  );
}
