import { jsPDF } from 'jspdf';
import { Transaction, UserProfile } from '@/types';

interface PdfExportOptions {
    user: UserProfile;
    transactions: Transaction[];
    month: Date;
    stats: {
        balance: number;
        income: number;
        expense: number;
    };
}

export const usePdfExport = () => {
    const exportMonthlyReport = ({
        user,
        transactions,
        month,
        stats
    }: PdfExportOptions) => {
        const doc = new jsPDF();
        const monthName = month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        // Header
        doc.setFillColor(99, 102, 241); // Indigo
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('OSEILLE', 20, 25);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Rapport Mensuel - ${monthName}`, 20, 35);

        // User info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`Compte: ${user.name}`, 130, 25);
        doc.text(`Email: ${user.email}`, 130, 32);

        // Statistics Section
        doc.setFillColor(248, 250, 252);
        doc.rect(15, 50, 180, 35, 'F');

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('RÉSUMÉ FINANCIER', 20, 60);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');

        // Balance
        doc.text('Solde', 25, 72);
        doc.setTextColor(stats.balance >= 0 ? 16 : 244, stats.balance >= 0 ? 185 : 63, stats.balance >= 0 ? 129 : 94);
        doc.text(`${stats.balance.toFixed(2)} €`, 25, 80);

        // Income
        doc.setTextColor(0, 0, 0);
        doc.text('Revenus', 85, 72);
        doc.setTextColor(16, 185, 129);
        doc.text(`+${stats.income.toFixed(2)} €`, 85, 80);

        // Expenses
        doc.setTextColor(0, 0, 0);
        doc.text('Dépenses', 145, 72);
        doc.setTextColor(244, 63, 94);
        doc.text(`-${stats.expense.toFixed(2)} €`, 145, 80);

        // Transactions table
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(10);
        doc.text('TRANSACTIONS DU MOIS', 20, 100);

        // Table header
        doc.setFillColor(241, 245, 249);
        doc.rect(15, 105, 180, 8, 'F');
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('Date', 20, 110);
        doc.text('Description', 50, 110);
        doc.text('Catégorie', 110, 110);
        doc.text('Montant', 160, 110);

        // Filter transactions for the month
        const monthTxs = transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate.getMonth() === month.getMonth() && txDate.getFullYear() === month.getFullYear();
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Table rows
        doc.setFont('helvetica', 'normal');
        let y = 120;
        monthTxs.slice(0, 25).forEach((tx, i) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            if (i % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(15, y - 5, 180, 8, 'F');
            }

            doc.setTextColor(0, 0, 0);
            doc.text(new Date(tx.date).toLocaleDateString('fr-FR'), 20, y);
            doc.text(tx.title.substring(0, 25), 50, y);
            doc.text(tx.category, 110, y);

            doc.setTextColor(tx.type === 'income' ? 16 : 244, tx.type === 'income' ? 185 : 63, tx.type === 'income' ? 129 : 94);
            doc.text(`${tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)} €`, 160, y);

            y += 8;
        });

        if (monthTxs.length > 25) {
            doc.setTextColor(100, 116, 139);
            doc.text(`... et ${monthTxs.length - 25} autres transactions`, 20, y + 10);
        }

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Généré par Oseille - ${new Date().toLocaleDateString('fr-FR')}`, 20, 290);
            doc.text(`Page ${i}/${pageCount}`, 180, 290);
        }

        // Download
        doc.save(`oseille-rapport-${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}.pdf`);
    };

    return { exportMonthlyReport };
};
