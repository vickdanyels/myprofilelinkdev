/**
 * PIX Code Generator
 * 
 * Generates PIX "copia e cola" codes following the BR Code EMV specification.
 * These codes can be used to generate QR codes or copied directly.
 */

// PIX Configuration
export const PIX_CONFIG = {
    key: "e82bde65-7da5-401c-ab8e-82120d557833",
    merchantName: "MYPROFILE",
    merchantCity: "SAO PAULO",
    description: "Upgrade MyProfile"
};

/**
 * Calculate CRC16-CCITT checksum for PIX code
 */
function calculateCRC16(payload: string): string {
    const polynomial = 0x1021;
    let crc = 0xFFFF;

    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
            crc &= 0xFFFF;
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Format a TLV (Tag-Length-Value) field
 */
function formatTLV(id: string, value: string): string {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
}

/**
 * Generate a PIX "copia e cola" code with a specific amount
 */
export function generatePixCode(amount: number, txId?: string): string {
    // Format amount with 2 decimal places
    const formattedAmount = amount.toFixed(2);

    // Generate transaction ID if not provided
    const transactionId = txId || `MP${Date.now().toString().slice(-10)}`;

    // Build the Merchant Account Information (ID 26)
    const gui = formatTLV("00", "br.gov.bcb.pix");
    const pixKey = formatTLV("01", PIX_CONFIG.key);
    const merchantAccountInfo = formatTLV("26", gui + pixKey);

    // Build the payload
    let payload = "";

    // Payload Format Indicator (ID 00)
    payload += formatTLV("00", "01");

    // Merchant Account Information (ID 26)
    payload += merchantAccountInfo;

    // Merchant Category Code (ID 52)
    payload += formatTLV("52", "0000");

    // Transaction Currency (ID 53) - BRL = 986
    payload += formatTLV("53", "986");

    // Transaction Amount (ID 54)
    payload += formatTLV("54", formattedAmount);

    // Country Code (ID 58)
    payload += formatTLV("58", "BR");

    // Merchant Name (ID 59)
    payload += formatTLV("59", PIX_CONFIG.merchantName);

    // Merchant City (ID 60)
    payload += formatTLV("60", PIX_CONFIG.merchantCity);

    // Additional Data Field (ID 62)
    const txIdField = formatTLV("05", transactionId);
    payload += formatTLV("62", txIdField);

    // CRC16 placeholder (ID 63) - will be calculated
    payload += "6304";

    // Calculate and append CRC16
    const crc = calculateCRC16(payload);
    payload = payload.slice(0, -4) + formatTLV("63", crc);

    return payload;
}

/**
 * Generate QR Code as Data URL
 */
export async function generatePixQRCode(amount: number): Promise<string> {
    const QRCode = (await import('qrcode')).default;
    const pixCode = generatePixCode(amount);

    return await QRCode.toDataURL(pixCode, {
        width: 280,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });
}
