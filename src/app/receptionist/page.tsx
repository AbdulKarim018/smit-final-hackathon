import SignedIn from "@/components/SignedIn";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoutButton from "./_components/LogoutButton";
import BeneficiaryForm from "./_components/BeneficiaryForm";
import { db } from "@/server/db";

export default async function ReceptionistPage() {
  const departments = await db.department.findMany();
  return (
    <SignedIn>
      <div>
        <header className="bg-gray-200 p-2">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <span></span>
            <h1>Receptionist</h1>
            <LogoutButton />
          </div>
        </header>
        {/* <Tabs>
          <TabsList>
            <TabsTrigger value={"visits"}>Visits</TabsTrigger>
            <TabsTrigger value={"visits"}>Visits</TabsTrigger>
            <TabsTrigger value={"visits"}>Visits</TabsTrigger>
          </TabsList>
        </Tabs> */}
        <div className="container mx-auto max-w-4xl p-4">
          <BeneficiaryForm departments={departments} />
        </div>
      </div>
    </SignedIn>
  );
}
