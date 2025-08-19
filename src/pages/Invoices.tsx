import { useState, useEffect } from 'react';
import { Plus, Download, CreditCard } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { addInvoice, getInvoices, Invoice } from '../firebase/invoices';
import { useAuth } from '../contexts/AuthContext';

function Invoices() {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!currentUser) return;
      const data = await getInvoices(currentUser.id, currentUser.role);
      setInvoices(data);
    };
    fetchInvoices();
  }, [currentUser]);

  const handleCreateInvoice = async () => {
    if (!currentUser) return;
    const employeeName = prompt('Employee Name');
    const amountStr = prompt('Amount');
    const dueDate = prompt('Due Date (YYYY-MM-DD)');
    const invoiceNumber = prompt('Invoice Number');
    if (!employeeName || !amountStr || !dueDate || !invoiceNumber) return;
    const newInvoice = await addInvoice({
      employeeId: currentUser.id,
      employeeName,
      amount: parseFloat(amountStr),
      dueDate,
      invoiceNumber,
    });
    setInvoices([newInvoice, ...invoices]);
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    if (selectedInvoice) {
      setInvoices(invoices.map(invoice =>
        invoice.id === selectedInvoice.id
          ? { ...invoice, status: 'paid' as const }
          : invoice
      ));
      setShowPaymentModal(false);
      setSelectedInvoice(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage and track your invoices.</p>
        </div>
        <button
          className="btn-primary flex items-center"
          onClick={handleCreateInvoice}
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Invoice
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Download className="h-4 w-4" />
                    </button>
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => handlePayment(invoice)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CreditCard className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && selectedInvoice && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onComplete={() => handlePaymentComplete()}
          amount={selectedInvoice.amount}
          invoiceId={selectedInvoice.id}
        />
      )}
    </div>
  );
}

export default Invoices;
