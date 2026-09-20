import { Member, IncomeRecord, ExpenseRecord, HomeGroup, Department } from '../types';

/**
 * Cleanly format number into UGX currency string
 */
export const formatUGX = (amount: number): string => {
  return `UGX ${amount.toLocaleString('en-US')}`;
};

/**
 * Core CSV escape and file downloader with UTF-8 BOM
 */
export const downloadCsv = (filename: string, headers: string[], rows: (string | number | undefined | null)[][]): void => {
  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((row) => row.map(escapeCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export Member List to CSV
 */
export const exportMembersToCsv = (
  members: Member[],
  homes: HomeGroup[] = [],
  departments: Department[] = [],
  filename = `manifest_members_roster_${new Date().toISOString().split('T')[0]}.csv`
): void => {
  const homeMap = new Map(homes.map((h) => [h.id, h.name]));
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  const headers = [
    'Membership ID',
    'Full Name',
    'Phone Number',
    'Alt Phone',
    'Email Address',
    'Gender',
    'Status',
    'First Timer Status',
    'Residence / Zone',
    'Hostel / Residence Name',
    'Is Student',
    'Campus / Institution',
    'Student Reg Number',
    'Course / Program',
    'Faculty',
    'Year of Study',
    'Home Cell / Group',
    'Ministry Departments',
    'How Found Manifest',
    'Invited By',
    'Date of First Attendance',
    'Registration Date',
    'Notes',
  ];

  const rows = members.map((m) => [
    m.id,
    m.fullName,
    m.phone,
    m.altPhone || '',
    m.email || '',
    m.gender,
    m.status,
    m.isFirstTimer ? 'Yes' : 'No',
    m.residence || '',
    m.hostelOrResidence || '',
    m.studentInfo?.isStudent ? 'Yes' : 'No',
    m.studentInfo?.campus || 'Non-Student / Working',
    m.studentInfo?.registrationNumber || '',
    m.studentInfo?.course || '',
    m.studentInfo?.faculty || '',
    m.studentInfo?.yearOfStudy ? `Year ${m.studentInfo.yearOfStudy}` : '',
    m.homeId ? homeMap.get(m.homeId) || m.homeId : 'Unassigned',
    m.departmentIds ? m.departmentIds.map((id) => deptMap.get(id) || id).join('; ') : '',
    m.howFoundManifest || '',
    m.invitedBy || '',
    m.dateOfFirstAttendance || '',
    m.registrationDate || '',
    m.notes || '',
  ]);

  downloadCsv(filename, headers, rows);
};

/**
 * Export Financial Summary & Statement to CSV
 */
export const exportFinancialSummaryToCsv = (
  income: IncomeRecord[],
  expenses: ExpenseRecord[],
  filename = `manifest_financial_summary_${new Date().toISOString().split('T')[0]}.csv`
): void => {
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Income category breakdown
  const incomeCategories = income.reduce<Record<string, { count: number; total: number }>>((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = { count: 0, total: 0 };
    acc[curr.category].count += 1;
    acc[curr.category].total += curr.amount;
    return acc;
  }, {});

  // Expense category breakdown
  const expenseCategories = expenses.reduce<Record<string, { count: number; total: number }>>((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = { count: 0, total: 0 };
    acc[curr.category].count += 1;
    acc[curr.category].total += curr.amount;
    return acc;
  }, {});

  // Payment method breakdown
  const paymentMethodSummary = [...income, ...expenses].reduce<Record<string, { inAmount: number; outAmount: number }>>((acc, curr) => {
    const method = curr.paymentMethod || 'Cash';
    if (!acc[method]) acc[method] = { inAmount: 0, outAmount: 0 };
    if ('category' in curr && Object.keys(incomeCategories).includes((curr as IncomeRecord).category)) {
      acc[method].inAmount += curr.amount;
    } else {
      acc[method].outAmount += curr.amount;
    }
    return acc;
  }, {});

  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const lines: string[] = [
    escapeCell('MANIFEST FELLOWSHIP K.I.U - OFFICIAL FINANCIAL SUMMARY REPORT'),
    escapeCell(`Generated Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`),
    escapeCell('Currency: UGX (Ugandan Shillings)'),
    '',
    escapeCell('--- EXECUTIVE TREASURY SUMMARY ---'),
    [escapeCell('Metric'), escapeCell('Amount (UGX)'), escapeCell('Status / Notes')].join(','),
    [escapeCell('Total Inflow / Income'), escapeCell(totalIncome), escapeCell(`${income.length} verified collections`)].join(','),
    [escapeCell('Total Outflow / Expenses'), escapeCell(totalExpenses), escapeCell(`${expenses.length} approved disbursements`)].join(','),
    [escapeCell('Net Operating Reserve / Balance'), escapeCell(netBalance), escapeCell(netBalance >= 0 ? 'Surplus Reserve' : 'Deficit Position')].join(','),
    '',
    escapeCell('--- INFLOW / INCOME CATEGORY BREAKDOWN ---'),
    [escapeCell('Category'), escapeCell('Transactions'), escapeCell('Total Amount (UGX)'), escapeCell('% Share of Inflow')].join(','),
    ...Object.entries(incomeCategories).map(([cat, stat]) =>
      [
        escapeCell(cat),
        escapeCell(stat.count),
        escapeCell(stat.total),
        escapeCell(`${totalIncome > 0 ? ((stat.total / totalIncome) * 100).toFixed(1) : '0'}%`),
      ].join(',')
    ),
    '',
    escapeCell('--- OUTFLOW / EXPENSE CATEGORY BREAKDOWN ---'),
    [escapeCell('Category'), escapeCell('Transactions'), escapeCell('Total Amount (UGX)'), escapeCell('% Share of Outflow')].join(','),
    ...Object.entries(expenseCategories).map(([cat, stat]) =>
      [
        escapeCell(cat),
        escapeCell(stat.count),
        escapeCell(stat.total),
        escapeCell(`${totalExpenses > 0 ? ((stat.total / totalExpenses) * 100).toFixed(1) : '0'}%`),
      ].join(',')
    ),
    '',
    escapeCell('--- PAYMENT CHANNEL UTILIZATION ---'),
    [escapeCell('Payment Channel'), escapeCell('Total Collections (UGX)'), escapeCell('Total Disbursements (UGX)')].join(','),
    ...Object.entries(paymentMethodSummary).map(([method, data]) =>
      [escapeCell(method), escapeCell(data.inAmount), escapeCell(data.outAmount)].join(',')
    ),
  ];

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export Detailed Income Ledger to CSV
 */
export const exportIncomeLedgerToCsv = (
  income: IncomeRecord[],
  filename = `manifest_income_ledger_${new Date().toISOString().split('T')[0]}.csv`
): void => {
  const headers = [
    'Voucher ID',
    'Date',
    'Category',
    'Description',
    'Amount (UGX)',
    'Payment Method',
    'Reference / Receipt No',
    'Received By Officer',
    'Associated Event / Project',
    'Reconciliation Status',
  ];

  const rows = income.map((inc) => [
    inc.id,
    inc.date,
    inc.category,
    inc.description,
    inc.amount,
    inc.paymentMethod,
    inc.referenceNumber || 'N/A',
    inc.receivedBy,
    inc.eventId || inc.projectId || 'General Fellowship',
    inc.status,
  ]);

  downloadCsv(filename, headers, rows);
};

/**
 * Export Detailed Expense Ledger to CSV
 */
export const exportExpenseLedgerToCsv = (
  expenses: ExpenseRecord[],
  filename = `manifest_expense_ledger_${new Date().toISOString().split('T')[0]}.csv`
): void => {
  const headers = [
    'Voucher ID',
    'Date',
    'Category',
    'Description',
    'Amount (UGX)',
    'Payment Method',
    'Requested By',
    'Approved By',
    'Disbursed / Paid To',
    'Approval Status',
    'Rejection / Audit Notes',
  ];

  const rows = expenses.map((exp) => [
    exp.id,
    exp.date,
    exp.category,
    exp.description,
    exp.amount,
    exp.paymentMethod || 'Cash',
    exp.requestedBy,
    exp.approvedBy || 'Pending Approval',
    exp.paidBy || 'N/A',
    exp.status,
    exp.rejectionReason || '',
  ]);

  downloadCsv(filename, headers, rows);
};

/**
 * Open a dedicated browser print window formatted as a professional PDF document
 */
export interface PrintableReportConfig {
  title: string;
  subtitle?: string;
  category: 'members' | 'financial' | 'executive';
  metrics: { label: string; value: string; hint?: string }[];
  tables: {
    heading: string;
    columns: string[];
    rows: (string | number)[][];
  }[];
  notes?: string;
  generatedBy?: string;
}

export const printReportAsPdf = (config: PrintableReportConfig): void => {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Please allow popups to generate and print the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${config.title} — Manifest Fellowship K.I.U</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.4;
    }
    .header-table {
      width: 100%;
      border-bottom: 2.5px solid #ea580c;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .header-logo-cell {
      width: 60px;
      vertical-align: middle;
    }
    .logo-badge {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #ea580c, #f59e0b);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 900;
      font-size: 22px;
      text-align: center;
      line-height: 48px;
      box-shadow: 0 2px 4px rgba(234, 88, 12, 0.3);
    }
    .header-text-cell {
      vertical-align: middle;
      padding-left: 14px;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 10px;
      color: #ea580c;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 2px 0 0 0;
    }
    .header-meta-cell {
      text-align: right;
      vertical-align: middle;
      font-size: 9px;
      color: #64748b;
      line-height: 1.3;
    }
    .report-title-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #ea580c;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
    }
    .report-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .report-sub {
      font-size: 10px;
      color: #475569;
      margin: 2px 0 0 0;
    }
    .metrics-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 18px;
      border-collapse: separate;
      border-spacing: 8px 0;
    }
    .metric-card {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 12px;
      vertical-align: top;
    }
    .metric-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .metric-value {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0 2px 0;
    }
    .metric-hint {
      font-size: 8.5px;
      color: #64748b;
    }
    .table-section {
      margin-bottom: 20px;
      page-break-inside: auto;
    }
    .table-heading {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1e293b;
      margin: 0 0 6px 0;
      padding-bottom: 3px;
      border-bottom: 1.5px solid #cbd5e1;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      margin-bottom: 8px;
      page-break-inside: auto;
    }
    table.data-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      font-size: 9px;
      text-transform: uppercase;
    }
    table.data-table td {
      padding: 5.5px 8px;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }
    table.data-table tr:nth-child(even) td {
      background: #fafafa;
    }
    .status-badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-active { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .status-first-timer { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
    .status-pending { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .status-completed { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
    .footer-stamp {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
      display: table;
      width: 100%;
      font-size: 8.5px;
      color: #64748b;
      page-break-inside: avoid;
    }
    .stamp-left {
      display: table-cell;
      width: 50%;
      vertical-align: bottom;
    }
    .stamp-right {
      display: table-cell;
      width: 50%;
      text-align: right;
      vertical-align: bottom;
    }
    .sign-lines {
      margin-top: 28px;
      display: table;
      width: 100%;
    }
    .sign-box {
      display: table-cell;
      width: 33.3%;
      padding-right: 15px;
      font-size: 8.5px;
    }
    .sign-rule {
      border-bottom: 1px solid #94a3b8;
      height: 24px;
      margin-bottom: 4px;
    }
    .sign-name {
      font-weight: 700;
      color: #334155;
    }
    .sign-title {
      color: #64748b;
      font-size: 8px;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td class="header-logo-cell">
        <div class="logo-badge">M</div>
      </td>
      <td class="header-text-cell">
        <h1 class="brand-title">Manifest Fellowship</h1>
        <div class="brand-sub">Kampala International University (K.I.U) • Kansanga Campus</div>
      </td>
      <td class="header-meta-cell">
        <strong>Official Executive Report</strong><br>
        Date: ${currentDate}<br>
        Time: ${currentTime}<br>
        Ref: MAN-DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}
      </td>
    </tr>
  </table>

  <!-- Title Box -->
  <div class="report-title-box">
    <h2 class="report-title">${config.title}</h2>
    ${config.subtitle ? `<p class="report-sub">${config.subtitle}</p>` : ''}
  </div>

  <!-- Key Metrics -->
  ${
    config.metrics && config.metrics.length > 0
      ? `
  <div class="metrics-grid">
    ${config.metrics
      .map(
        (m) => `
      <div class="metric-card">
        <div class="metric-label">${m.label}</div>
        <div class="metric-value">${m.value}</div>
        ${m.hint ? `<div class="metric-hint">${m.hint}</div>` : ''}
      </div>
    `
      )
      .join('')}
  </div>
  `
      : ''
  }

  <!-- Data Tables -->
  ${config.tables
    .map(
      (tbl) => `
    <div class="table-section">
      <h3 class="table-heading">${tbl.heading} (${tbl.rows.length} records)</h3>
      <table class="data-table">
        <thead>
          <tr>
            ${tbl.columns.map((c) => `<th>${c}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${
            tbl.rows.length === 0
              ? `<tr><td colspan="${tbl.columns.length}" style="text-align:center;color:#94a3b8;padding:12px;">No matching records found.</td></tr>`
              : tbl.rows
                  .map(
                    (row) => `
              <tr>
                ${row
                  .map((cell) => {
                    const str = String(cell);
                    if (str === 'Active' || str === 'Reconciled' || str === 'Joined' || str === 'Completed') {
                      return `<td><span class="status-badge status-active">${str}</span></td>`;
                    }
                    if (str === 'First Timer') {
                      return `<td><span class="status-badge status-first-timer">${str}</span></td>`;
                    }
                    if (str === 'Pending' || str === 'Assigned') {
                      return `<td><span class="status-badge status-pending">${str}</span></td>`;
                    }
                    return `<td>${cell !== undefined && cell !== null ? cell : ''}</td>`;
                  })
                  .join('')}
              </tr>
            `
                  )
                  .join('')
          }
        </tbody>
      </table>
    </div>
  `
    )
    .join('')}

  <!-- Signatures Block for Official Distribution -->
  <div class="sign-lines">
    <div class="sign-box">
      <div class="sign-rule"></div>
      <div class="sign-name">Prepared By: ${config.generatedBy || 'HOD Registration / Admin'}</div>
      <div class="sign-title">Manifest Fellowship Coordinator</div>
    </div>
    <div class="sign-box">
      <div class="sign-rule"></div>
      <div class="sign-name">Verified By: Finance & Audit Officer</div>
      <div class="sign-title">Treasury Secretariat</div>
    </div>
    <div class="sign-box">
      <div class="sign-rule"></div>
      <div class="sign-name">Pastoral Endorsement</div>
      <div class="sign-title">Fellowship Overseer / Patron</div>
    </div>
  </div>

  <!-- Footer Stamp -->
  <div class="footer-stamp">
    <div class="stamp-left">
      Manifest Fellowship K.I.U Secretariat • Kansanga, Ggaba Road, Kampala, Uganda<br>
      Strictly Confidential — Prepared for Leadership & Executive Oversight.
    </div>
    <div class="stamp-right">
      Page 1 of 1 • System Certified Export
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
