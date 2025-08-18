import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SizeChartModal = ({ open, onClose }) => {
  if (!open) return null;

  const sizeChartData = [
    { size: 'XS (6)', waist: '30"', bust: '34"', hip: '36"', shoulder: '13.5"' },
    { size: 'S (8)', waist: '32"', bust: '36"', hip: '38"', shoulder: '14"' },
    { size: 'M (10)', waist: '34"', bust: '38"', hip: '40"', shoulder: '14.5"' },
    { size: 'L (12)', waist: '36"', bust: '40"', hip: '42"', shoulder: '15"' },
    { size: 'XL (14)', waist: '38"', bust: '42"', hip: '44"', shoulder: '15.5"' },
    { size: '2XL (16)', waist: '40"', bust: '44"', hip: '46"', shoulder: '16"' },
    { size: '3XL (18)', waist: '42"', bust: '46"', hip: '48"', shoulder: '16.5"' },
    { size: '4XL (20)', waist: '44"', bust: '48"', hip: '50"', shoulder: '17"' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl mx-auto rounded-xl shadow-2xl border border-border bg-card p-6 animate-slideDown max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-foreground">Size Chart</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                  Size
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                  Waist
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                  Bust
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                  Hip
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                  Shoulder
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeChartData.map((row, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="border border-border px-4 py-3 font-medium text-foreground">
                    {row.size}
                  </td>
                  <td className="border border-border px-4 py-3 text-muted-foreground">
                    {row.waist}
                  </td>
                  <td className="border border-border px-4 py-3 text-muted-foreground">
                    {row.bust}
                  </td>
                  <td className="border border-border px-4 py-3 text-muted-foreground">
                    {row.hip}
                  </td>
                  <td className="border border-border px-4 py-3 text-muted-foreground">
                    {row.shoulder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Guide */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold text-foreground mb-3">How to Measure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p><strong>Bust:</strong> Measure around the fullest part of your chest</p>
              <p><strong>Waist:</strong> Measure around your natural waistline</p>
            </div>
            <div>
              <p><strong>Hip:</strong> Measure around the fullest part of your hips</p>
              <p><strong>Shoulder:</strong> Measure from shoulder point to shoulder point</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="default">
            Got it
          </Button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        .animate-fadeIn { 
          animation: fadeIn 0.2s; 
        }
        @keyframes slideDown { 
          from { transform: translateY(-32px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        .animate-slideDown { 
          animation: slideDown 0.25s cubic-bezier(.4,1.7,.7,1) forwards; 
        }
      `}</style>
    </div>
  );
};

export default SizeChartModal;
