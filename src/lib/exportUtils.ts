import { TeamRecord } from './adminStore';
import { MemberData } from '../types/registration';

export function exportTeamsToCSV(teams: TeamRecord[], filename = 'DISFRUTAR_2K26_Teams_Report.csv') {
  const headers = [
    'Team ID',
    'Team Name',
    'Member Count',
    'Payment Status',
    'Amount (₹)',
    'Transaction ID',
    'Submitted At',
    'Leader Name',
    'Leader Reg No',
    'Leader Phone',
    'Leader Dept',
    'Leader Residence',
    'Leader Hostel',
    'Leader Room',
    'Leader Warden'
  ];

  const rows = teams.map(t => {
    const leader: Partial<MemberData> = t.members[0] || {};
    return [
      `"${t.id}"`,
      `"${t.teamName.replace(/"/g, '""')}"`,
      t.memberCount,
      `"${t.paymentStatus.toUpperCase()}"`,
      t.amount,
      `"${t.transactionId.replace(/"/g, '""')}"`,
      `"${t.submittedAt}"`,
      `"${(leader.name || '').replace(/"/g, '""')}"`,
      `"${(leader.registerNumber || '').replace(/"/g, '""')}"`,
      `"${(leader.phone || '').replace(/"/g, '""')}"`,
      `"${(leader.department || '').replace(/"/g, '""')}"`,
      `"${(leader.residenceType || '').replace(/"/g, '""')}"`,
      `"${(leader.hostelName || 'N/A').replace(/"/g, '""')}"`,
      `"${(leader.roomNumber || 'N/A').replace(/"/g, '""')}"`,
      `"${(leader.wardenName || 'N/A').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePrintableReportHTML(
  teams: TeamRecord[],
  reportTitle: string,
  filterDescription = 'All Categories'
) {
  const currentDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const totalMembers = teams.reduce((acc, t) => acc + t.memberCount, 0);

  let rowsHTML = '';
  teams.forEach((t, idx) => {
    const leader: Partial<MemberData> = t.members[0] || {};
    const hostellersCount = t.members.filter(m => m.residenceType === 'Hosteller').length;
    
    rowsHTML += `
      <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 1 ? 'background-color: #f8fafc;' : ''}">
        <td style="padding: 10px; font-weight: 600;">${t.id}</td>
        <td style="padding: 10px;">
          <div style="font-weight: 700; color: #0f172a;">${t.teamName}</div>
          <div style="font-size: 11px; color: #64748b;">Txn: ${t.transactionId}</div>
        </td>
        <td style="padding: 10px;">
          <div style="font-weight: 600;">${leader.name || 'N/A'}</div>
          <div style="font-size: 11px; color: #64748b;">Reg: ${leader.registerNumber || 'N/A'}</div>
          <div style="font-size: 11px; color: #3b82f6;">Mob: ${leader.phone || 'N/A'}</div>
        </td>
        <td style="padding: 10px; font-size: 12px;">
          ${leader.department || 'N/A'} (${leader.section || 'N/A'})
        </td>
        <td style="padding: 10px; font-size: 12px;">
          <strong>${t.memberCount} Members</strong><br/>
          <span style="font-size: 10px; color: #64748b;">${hostellersCount} Hosteller(s)</span>
        </td>
        <td style="padding: 10px; font-weight: 700;">
          ₹${t.amount}
        </td>
        <td style="padding: 10px;">
          <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; ${
            t.paymentStatus === 'approved'
              ? 'background-color: #dcfce7; color: #15803d;'
              : t.paymentStatus === 'rejected'
              ? 'background-color: #fee2e2; color: #b91c1c;'
              : 'background-color: #fef3c7; color: #b45309;'
          }">
            ${t.paymentStatus}
          </span>
        </td>
      </tr>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} - DISFRUTAR 2K26</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; font-size: 12px; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 20px; font-weight: 800; color: #1e1b4b; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
          .subtitle { font-size: 13px; color: #3b82f6; font-weight: 600; margin-top: 4px; }
          .meta { font-size: 11px; color: #64748b; text-align: right; }
          .summary-bar { background: #f1f5f9; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; font-weight: 600; font-size: 11px; border: 1px solid #cbd5e1; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: left; }
          th { background: #1e1b4b; color: #ffffff; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">KARE ACM • DISFRUTAR 2K26</div>
            <div class="subtitle">${reportTitle}</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${currentDate}</div>
            <div><strong>Scope:</strong> ${filterDescription}</div>
            <div><strong>Admin Portal:</strong> Verified</div>
          </div>
        </div>

        <div class="summary-bar">
          <div>TOTAL TEAMS: <strong>${teams.length}</strong></div>
          <div>TOTAL PARTICIPANTS: <strong>${totalMembers}</strong></div>
          <div>STATUS: <strong>${reportTitle}</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Team Details</th>
              <th>Leader Info</th>
              <th>Dept / Sec</th>
              <th>Members</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #64748b;">No matching teams found.</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          DISFRUTAR 2K26 Official Registration Report • Generated via Admin Operations Portal • KARE ACM Student Chapter
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
}

export function openPrintablePDF(teams: TeamRecord[], reportTitle: string, filterDescription?: string) {
  const html = generatePrintableReportHTML(teams, reportTitle, filterDescription);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    alert('Please allow popups to download or view printable PDF reports.');
  }
}
