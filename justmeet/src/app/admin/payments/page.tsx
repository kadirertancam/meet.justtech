import { prisma } from "@/lib/prisma"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({ include: { user: true } })
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Payments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.user?.email ?? ""}</TableCell>
              <TableCell>${'{'}payment.amount / 100{'}'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
