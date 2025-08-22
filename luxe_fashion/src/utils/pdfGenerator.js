import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateOrderPDF = async (orderData) => {
  try {
    // Validate required data
    if (!orderData || !orderData.orderNumber || !orderData.items) {
      throw new Error('Invalid order data provided');
    }

    // Create a temporary div for PDF content
    const pdfContent = document.createElement('div');
    pdfContent.style.width = '800px';
    pdfContent.style.padding = '40px';
    pdfContent.style.backgroundColor = '#ffffff';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    pdfContent.style.top = '0';
    
    // Generate HTML content for PDF
    pdfContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #92b174; font-size: 28px; margin: 0; font-weight: bold;">9ty two</h1>
        <p style="color: #666; margin: 5px 0;">Luxe Fashion Store</p>
        <p style="color: #666; margin: 5px 0; font-size: 12px;">Order Receipt</p>
      </div>

      <div style="border-bottom: 2px solid #92b174; padding-bottom: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h2 style="color: #333; font-size: 20px; margin: 0 0 10px 0;">Order #${orderData.orderNumber}</h2>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">
              Placed on ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">
              Order Status: Confirmed
            </p>
          </div>
          <div style="text-align: right;">
            <p style="color: #666; margin: 5px 0; font-size: 14px;">Receipt Date</p>
            <p style="color: #333; margin: 5px 0; font-size: 14px; font-weight: bold;">
              ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #333; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">
            Shipping Address
          </h3>
          <div style="color: #666; font-size: 14px; line-height: 1.6;">
            <p style="margin: 5px 0; font-weight: bold;">${orderData.shippingAddress?.name || 'Customer'}</p>
            <p style="margin: 5px 0;">${orderData.shippingAddress?.address || 'Address not provided'}</p>
            <p style="margin: 5px 0;">${orderData.shippingAddress?.city || ''}, ${orderData.shippingAddress?.state || ''} ${orderData.shippingAddress?.zipCode || ''}</p>
            <p style="margin: 5px 0;">${orderData.shippingAddress?.country || 'India'}</p>
            <p style="margin: 5px 0;">Phone: ${orderData.shippingAddress?.phone || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 style="color: #333; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">
            Payment Information
          </h3>
          <div style="color: #666; font-size: 14px; line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.payment?.brand || 'Online Payment'}</p>
            <p style="margin: 5px 0;"><strong>Card:</strong> •••• •••• •••• ${orderData.payment?.last4 || '****'}</p>
            <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${orderData.payment?.transactionId || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Payment Status:</strong> Paid</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">
          Order Items
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8f9fa; border-bottom: 2px solid #92b174;">
              <th style="text-align: left; padding: 12px; color: #333; font-weight: bold;">Item</th>
              <th style="text-align: center; padding: 12px; color: #333; font-weight: bold;">Size</th>
              <th style="text-align: center; padding: 12px; color: #333; font-weight: bold;">Qty</th>
              <th style="text-align: right; padding: 12px; color: #333; font-weight: bold;">Price</th>
              <th style="text-align: right; padding: 12px; color: #333; font-weight: bold;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; color: #333;">
                  <div>
                    <p style="margin: 0; font-weight: bold;">${item.name || 'Product'}</p>
                    <p style="margin: 5px 0; color: #666; font-size: 12px;">${item.brand || 'Brand'}</p>
                  </div>
                </td>
                <td style="padding: 12px; text-align: center; color: #666;">${item.size || 'N/A'}</td>
                <td style="padding: 12px; text-align: center; color: #666;">${item.quantity || 1}</td>
                <td style="padding: 12px; text-align: right; color: #666;">₹${(item.price || 0).toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; color: #333; font-weight: bold;">₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="border-top: 2px solid #92b174; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="color: #666; font-size: 14px;">Subtotal:</span>
          <span style="color: #333; font-size: 14px;">₹${(orderData.subtotal || orderData.total || 0).toFixed(2)}</span>
        </div>
        ${(orderData.discount || 0) > 0 ? `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="color: #666; font-size: 14px;">Discount:</span>
            <span style="color: #28a745; font-size: 14px;">-₹${(orderData.discount || 0).toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="color: #666; font-size: 14px;">Shipping:</span>
          <span style="color: #333; font-size: 14px;">${(orderData.shipping || 0) === 0 ? 'Free' : `₹${(orderData.shipping || 0).toFixed(2)}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 10px;">
          <span style="color: #333; font-size: 18px; font-weight: bold;">Total:</span>
          <span style="color: #92b174; font-size: 20px; font-weight: bold;">₹${(orderData.total || 0).toFixed(2)}</span>
        </div>
      </div>

      <div style="margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h4 style="color: #333; font-size: 16px; margin: 0 0 15px 0;">Order Summary</h4>
        <div style="color: #666; font-size: 14px; line-height: 1.6;">
          <p style="margin: 5px 0;"><strong>Total Items:</strong> ${orderData.items.reduce((sum, item) => sum + (item.quantity || 1), 0)}</p>
          <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p style="margin: 5px 0;"><strong>Order Status:</strong> Confirmed</p>
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="margin: 5px 0;">Thank you for shopping with 9ty two!</p>
        <p style="margin: 5px 0;">For any questions, please contact our customer support</p>
        <p style="margin: 5px 0;">Email: support@9tytwo.com | Phone: +91-XXXXXXXXXX</p>
      </div>
    `;

    // Add to document temporarily
    document.body.appendChild(pdfContent);

    // Convert to canvas
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Remove temporary element
    document.body.removeChild(pdfContent);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    pdf.save(`order-${orderData.orderNumber}-receipt.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
