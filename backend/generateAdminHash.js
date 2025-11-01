import bcrypt from 'bcryptjs'; // ใช้ bcryptjs เพื่อให้เทียบได้กับ hash ที่ใช้ในระบบของมอส

const plainPassword = '123456'; // รหัส admin ที่ต้องการใช้

async function generateHash() {
  try {
    const hash = await bcrypt.hash(plainPassword, 10);
    console.log('🔐 Admin password hash:\n', hash);
  } catch (err) {
    console.error('❌ Error generating hash:', err);
  }
}

generateHash();
