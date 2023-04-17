import { Input } from "@/components/input";
import { Table } from "@/components/table";
import { Dialog } from "@headlessui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
  phoneNumber: z.string().nonempty(),
});

type Contact = z.infer<typeof formSchema>;

const columnHelper = createColumnHelper<Contact>();

const columns = [
  columnHelper.accessor("firstName", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("lastName", {
    header: () => "Surname",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("email", {
    header: () => "E-mail",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("phoneNumber", {
    header: () => "Phone",
    cell: (info) => info.getValue(),
  }),
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(() => []);

  const form = useForm({ resolver: zodResolver(formSchema) });

  function handleAddContact(data: any) {
    setContacts((contacts) => [data, ...contacts]);
    closeAddContactModal();
  }

  function closeAddContactModal() {
    form.reset();
    setIsOpen(false);
  }

  return (
    <>
      <div className="h-screen bg-neutral-900 text-white overflow-auto">
        <header className="h-20 border-b flex border-neutral-800">
          <div className="container mx-auto flex items-center justify-between">
            <div className="font-bold text-xl">Contact Book</div>
          </div>
        </header>

        <div className="mx-auto container mt-6">
          <main className="flex-auto flex flex-col gap-6">
            <div className="flex justify-end">
              <button
                className="bg-purple-500 text-sm font-semibold px-6 h-10 rounded"
                onClick={() => setIsOpen(true)}
              >
                Add
              </button>
            </div>
            <div className="flex-auto flex flex-col gap-4">
              {contacts.length ? (
                <Table data={contacts} columns={columns} />
              ) : (
                <div className="flex items-center justify-center text-neutral-400 h-60">
                  <p>You dont have any friends.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Dialog
        className="relative z-50"
        open={isOpen}
        onClose={closeAddContactModal}
      >
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-neutral-900 p-4 border border-neutral-800 shadow text-white">
            <Dialog.Title className="text-2xl font-semibold mt-2 mb-8">
              Add new Contact
            </Dialog.Title>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleAddContact)}>
                <div>
                  <div className="flex gap-4">
                    <Input.Field>
                      <Input.Label>Name</Input.Label>
                      <Input.Entry name="firstName" />
                    </Input.Field>
                    <Input.Field>
                      <Input.Label>Surname</Input.Label>
                      <Input.Entry name="lastName" />
                    </Input.Field>
                  </div>

                  <Input.Field>
                    <Input.Label>E-mail</Input.Label>
                    <Input.Entry name="email" />
                  </Input.Field>

                  <Input.Field>
                    <Input.Label>Phone</Input.Label>
                    <Input.Entry name="phoneNumber" />
                  </Input.Field>
                </div>

                <div className="flex gap-4 justify-end mt-4">
                  <button
                    className="bg-neutral-700 text-sm font-semibold px-6 h-10 rounded"
                    onClick={closeAddContactModal}
                  >
                    Cancel
                  </button>
                  <button className="bg-purple-500 text-sm font-semibold px-6 h-10 rounded">
                    Save
                  </button>
                </div>
              </form>
            </FormProvider>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
