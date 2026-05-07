/**
 * HOW TO SET THIS UP:
 * 1. Go to Google Sheets (sheets.google.com) and create a new blank spreadsheet.
 * 2. Name the spreadsheet "DressCraft Orders".
 * 3. In the top menu, click Extensions -> Apps Script.
 * 4. A new tab will open. Delete any code in the editor and paste ALL of this code there.
 * 5. Important: Change the "YOUR_EMAIL_HERE" below to your actual Gmail address!
 * 6. Click the "Deploy" button (top right) -> "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set "Execute as": "Me".
 * 9. Set "Who has access": "Anyone".
 * 10. Click Deploy. (It may ask you to Authorize permissions - click Advanced -> Go to script).
 * 11. Copy the "Web app URL" it gives you.
 * 12. Paste that URL into the `script.js` file on your website (replace the SCRIPT_URL variable).
 */

// CHANGE THIS TO YOUR ACTUAL EMAIL ADDRESS
var ADMIN_EMAIL = "srihari2005273@gmail.com";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);

    // Handle Order Cancellation
    if (data.action === "CANCEL") {
      var dataRange = sheet.getDataRange();
      var values = dataRange.getValues();
      var cancelledCount = 0;
      
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === data.orderId) {
          // Highlight row red to indicate cancellation
          sheet.getRange(i + 1, 1, 1, sheet.getLastColumn()).setBackground("#ffcccc");
          sheet.getRange(i + 1, 1).setValue(data.orderId + " [CANCELLED]");
          cancelledCount++;
        }
      }

      if (cancelledCount > 0 && ADMIN_EMAIL !== "YOUR_EMAIL_HERE@gmail.com") {
        MailApp.sendEmail({
          to: ADMIN_EMAIL,
          subject: "⚠️ Order Cancelled: " + data.orderId,
          body: "The customer has cancelled their order.\n\nOrder ID: " + data.orderId + "\n\nPlease check your Google Sheet for details and refund the transaction if they already paid."
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "Order cancelled" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Handle Order Delivery Confirmation
    if (data.action === "DELIVER") {
      var dataRange = sheet.getDataRange();
      var values = dataRange.getValues();
      var deletedCount = 0;
      
      // Loop backwards when deleting rows to avoid shifting index issues
      for (var i = values.length - 1; i >= 1; i--) {
        // Column A (index 0) is Order ID, Column D (index 3) is Phone Number
        if (values[i][0] === data.orderId) {
          // Verify Phone Number
          if (String(values[i][3]).trim() === String(data.phone).trim()) {
            sheet.deleteRow(i + 1); // +1 because array is 0-indexed but rows are 1-indexed
            deletedCount++;
          } else {
            return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": "Phone number does not match this order." }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }

      if (deletedCount > 0) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "Delivery confirmed and removed from sheet." }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": "Order ID not found." }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Check if headers exist, if not, create them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Order ID", "Timestamp", "Customer Name", "Phone Number", "Delivery Address", "Dress Type", "Color", "Size", "Price", "Transaction ID"]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#f43397").setFontColor("#ffffff");
    }

    var timestamp = new Date();
    var orderId = data.orderId || "ORD-" + Math.floor(Math.random() * 1000000);
    
    var customerName = data.customerName || "N/A";
    var customerPhone = data.customerPhone || "N/A";
    var deliveryAddress = data.deliveryAddress || "N/A";
    var transactionId = data.transactionId || "N/A";

    var emailBody = "New Order Received!\n\nOrder ID: " + orderId + "\n";
    emailBody += "Customer Name: " + customerName + "\n";
    emailBody += "Phone: " + customerPhone + "\n";
    emailBody += "Address: " + deliveryAddress + "\n";
    emailBody += "Transaction ID: " + transactionId + "\n\nItems:\n";

    // Add items to sheet
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      sheet.appendRow([
        orderId,
        timestamp,
        customerName,
        customerPhone,
        deliveryAddress,
        item.dressType,
        item.color,
        item.size,
        item.price,
        transactionId
      ]);
      emailBody += "- " + item.dressType + " (Size: " + item.size + ", Color: " + item.color + ") - ₹" + item.price + "\n";
    }

    // Send Email Notification
    if (ADMIN_EMAIL !== "YOUR_EMAIL_HERE@gmail.com") {
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        subject: "🎉 New Order Placed: " + orderId,
        body: emailBody
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "orderId": orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.JSON);
}
