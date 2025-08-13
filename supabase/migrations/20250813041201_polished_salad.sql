/*
  # Insert Initial Sample Data

  1. Sample Data
    - Default admin user
    - Sample profile data
    - Sample packages and add-ons
    - Sample cards and financial pockets

  2. Notes
    - This creates realistic sample data for testing
    - All data uses proper UUIDs and relationships
*/

-- Insert default admin user (if not exists)
INSERT INTO users (id, email, password_hash, full_name, role, permissions) 
VALUES (
  'usr_admin_001',
  'admin@venapictures.com',
  'password123', -- In production, this should be properly hashed
  'Administrator Vena Pictures',
  'Admin',
  '[]'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert sample member user
INSERT INTO users (id, email, password_hash, full_name, role, permissions) 
VALUES (
  'usr_member_001',
  'member@venapictures.com',
  'password123',
  'Staff Member',
  'Member',
  '["Manajemen Klien", "Proyek", "Keuangan"]'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert default profile
INSERT INTO profiles (
  id,
  full_name,
  email,
  phone,
  company_name,
  website,
  address,
  bank_account,
  authorized_signer,
  bio,
  income_categories,
  expense_categories,
  project_types,
  event_types,
  asset_categories,
  sop_categories,
  project_status_config,
  briefing_template,
  terms_and_conditions
) VALUES (
  'profile_001',
  'Vena Pictures',
  'admin@venapictures.com',
  '+62812345678',
  'Vena Pictures',
  'https://venapictures.com',
  'Jakarta, Indonesia',
  'BCA 1234567890 a.n. Vena Pictures',
  'Vena Pictures',
  'Vendor fotografi dan videografi profesional untuk berbagai acara spesial Anda.',
  '["DP Proyek", "Pelunasan Proyek", "Penjualan Aset", "Lainnya"]'::jsonb,
  '["Gaji Freelancer", "Transportasi", "Peralatan", "Marketing", "Operasional", "Lainnya"]'::jsonb,
  '["Pernikahan", "Prewedding", "Engagement", "Birthday Party", "Corporate Event", "Graduation", "Lainnya"]'::jsonb,
  '["Meeting Klien", "Survey Lokasi", "Libur", "Workshop", "Lainnya"]'::jsonb,
  '["Kamera", "Lensa", "Lighting", "Audio", "Aksesoris", "Komputer", "Software", "Lainnya"]'::jsonb,
  '["Fotografi", "Videografi", "Editing", "Administrasi", "Marketing", "Umum"]'::jsonb,
  '[
    {"id": "status_1", "name": "Dikonfirmasi", "color": "#3b82f6", "note": "Proyek telah dikonfirmasi oleh klien", "subStatuses": []},
    {"id": "status_2", "name": "Briefing", "color": "#8b5cf6", "note": "Tahap briefing dengan klien", "subStatuses": [{"name": "Briefing Awal", "note": "Diskusi konsep dan ekspektasi"}, {"name": "Moodboard", "note": "Pembuatan referensi visual"}]},
    {"id": "status_3", "name": "Persiapan", "color": "#f97316", "note": "Persiapan tim dan peralatan", "subStatuses": [{"name": "Assign Tim", "note": "Penugasan fotografer dan videografer"}, {"name": "Cek Peralatan", "note": "Pemeriksaan kamera dan equipment"}]},
    {"id": "status_4", "name": "Pelaksanaan", "color": "#06b6d4", "note": "Hari pelaksanaan acara", "subStatuses": []},
    {"id": "status_5", "name": "Editing", "color": "#eab308", "note": "Proses editing foto dan video", "subStatuses": [{"name": "Seleksi Foto", "note": "Pemilihan foto terbaik"}, {"name": "Editing Foto", "note": "Retouching dan color grading"}, {"name": "Editing Video", "note": "Video editing dan post-production"}]},
    {"id": "status_6", "name": "Review Klien", "color": "#6366f1", "note": "Klien melakukan review hasil", "subStatuses": []},
    {"id": "status_7", "name": "Printing", "color": "#ec4899", "note": "Proses cetak album dan foto", "subStatuses": [{"name": "Desain Album", "note": "Layout dan desain album"}, {"name": "Proses Cetak", "note": "Pencetakan fisik album"}]},
    {"id": "status_8", "name": "Dikirim", "color": "#10b981", "note": "Pengiriman hasil ke klien", "subStatuses": []},
    {"id": "status_9", "name": "Selesai", "color": "#10b981", "note": "Proyek telah selesai", "subStatuses": []},
    {"id": "status_10", "name": "Dibatalkan", "color": "#ef4444", "note": "Proyek dibatalkan", "subStatuses": []}
  ]'::jsonb,
  'Halo tim! 📸\n\nProyek baru telah ditugaskan kepada Anda:\n\n📅 Tanggal: [DATE]\n📍 Lokasi: [LOCATION]\n👥 Klien: [CLIENT]\n📝 Jenis: [TYPE]\n\nSilakan cek detail lengkap di portal freelancer Anda.\n\nTerima kasih!',
  '📜 SYARAT & KETENTUAN UMUM\n\n📅 Jadwal & Waktu\n- Jadwal pemotretan yang telah disepakati tidak dapat diubah kecuali ada kesepakatan baru\n- Keterlambatan klien maksimal 2 jam, lebih dari itu akan dikenakan biaya tambahan\n- Pembatalan mendadak (H-3) akan dikenakan denda 50% dari total biaya\n\n💰 Pembayaran\n- DP minimal 30% dari total biaya saat konfirmasi booking\n- Pelunasan dilakukan maksimal H-3 sebelum hari pelaksanaan\n- Pembayaran melalui transfer bank ke rekening yang telah ditentukan\n- DP yang sudah dibayarkan tidak dapat dikembalikan jika terjadi pembatalan\n\n📦 Hasil & Penyerahan\n- Hasil foto/video diserahkan sesuai timeline yang disepakati\n- Revisi minor dapat dilakukan maksimal 2x tanpa biaya tambahan\n- File mentah tidak diserahkan kepada klien\n- Hak cipta tetap milik Vena Pictures untuk keperluan promosi\n\n⏱ Timeline Pengerjaan\n- Editing foto: 2-4 minggu setelah acara\n- Editing video: 4-8 minggu setelah acara\n- Cetak album: 2-3 minggu setelah approval design\n\n➕ Ketentuan Tambahan\n- Klien wajib menyediakan akses lokasi dan fasilitas yang dibutuhkan\n- Vena Pictures tidak bertanggung jawab atas kerusakan/kehilangan barang klien\n- Force majeure (bencana alam, dll) dapat mengubah kesepakatan\n- Perubahan scope pekerjaan akan dikenakan biaya tambahan'
) ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample packages
INSERT INTO packages (id, name, price, physical_items, digital_items, processing_time, photographers, videographers) VALUES
('pkg_001', 'Paket Basic Wedding', 8500000, '[{"name": "Album 20x30 (20 halaman)", "price": 500000}]'::jsonb, '["300+ foto edit terbaik", "File digital JPG high-resolution", "Online gallery 1 tahun"]', '30 hari kerja', '2 Fotografer', ''),
('pkg_002', 'Paket Premium Wedding', 15000000, '[{"name": "Album 30x40 (30 halaman)", "price": 800000}, {"name": "Mini album 20x20", "price": 300000}]'::jsonb, '["500+ foto edit terbaik", "Video highlight 3-5 menit", "File digital JPG + RAW", "Online gallery 2 tahun"]', '45 hari kerja', '3 Fotografer', '1 Videografer'),
('pkg_003', 'Paket Prewedding', 3500000, '[{"name": "Cetak foto 4R (50 lembar)", "price": 200000}]'::jsonb, '["100+ foto edit terbaik", "File digital JPG high-resolution"]', '14 hari kerja', '1 Fotografer', ''),
('pkg_004', 'Paket Engagement', 2500000, '[]'::jsonb, '["80+ foto edit terbaik", "File digital JPG high-resolution", "Online gallery 6 bulan"]', '10 hari kerja', '1 Fotografer', '')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample add-ons
INSERT INTO add_ons (id, name, price) VALUES
('addon_001', 'Drone Photography', 1500000),
('addon_002', 'Same Day Edit Video', 2000000),
('addon_003', 'Extra Photographer', 1000000),
('addon_004', 'Photo Booth Setup', 1200000),
('addon_005', 'Live Streaming', 2500000)
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample cards
INSERT INTO cards (id, card_holder_name, bank_name, card_type, last_four_digits, balance, color_gradient) VALUES
('card_001', 'Vena Pictures', 'BCA', 'Debit', '1234', 25000000, 'from-blue-500 to-sky-400'),
('card_002', 'Vena Pictures', 'Mandiri', 'Debit', '5678', 15000000, 'from-green-500 to-emerald-400'),
('card_003', 'Cash', 'Tunai', 'Prabayar', '0000', 5000000, 'from-slate-600 to-slate-500')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample financial pockets
INSERT INTO financial_pockets (id, name, description, icon, type, amount, goal_amount, source_card_id) VALUES
('pocket_001', 'Dana Darurat', 'Tabungan untuk keperluan mendesak', 'piggy-bank', 'Nabung & Bayar', 10000000, 20000000, 'card_001'),
('pocket_002', 'Investasi Peralatan', 'Dana untuk pembelian kamera dan equipment baru', 'lock', 'Terkunci', 8000000, 50000000, 'card_001'),
('pocket_003', 'Bonus Tim', 'Pool hadiah untuk freelancer berprestasi', 'star', 'Tabungan Hadiah Freelancer', 3000000, NULL, 'card_002'),
('pocket_004', 'Marketing Budget', 'Anggaran untuk promosi dan iklan', 'clipboard-list', 'Anggaran Pengeluaran', 2000000, 5000000, 'card_002'),
('pocket_005', 'Operasional Harian', 'Dana untuk operasional sehari-hari', 'users', 'Bersama', 12000000, NULL, 'card_001')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample team members
INSERT INTO team_members (id, name, role, email, phone, standard_fee, no_rek, reward_balance, rating, portal_access_id) VALUES
('team_001', 'Ahmad Rizki', 'Fotografer Senior', 'ahmad@example.com', '+6281234567890', 800000, 'BCA 9876543210', 500000, 4.8, 'portal_freelancer_001'),
('team_002', 'Sari Indah', 'Videografer', 'sari@example.com', '+6281234567891', 1000000, 'Mandiri 1122334455', 300000, 4.9, 'portal_freelancer_002'),
('team_003', 'Budi Santoso', 'Editor Foto', 'budi@example.com', '+6281234567892', 600000, 'BNI 5566778899', 200000, 4.7, 'portal_freelancer_003'),
('team_004', 'Maya Putri', 'Editor Video', 'maya@example.com', '+6281234567893', 750000, 'BRI 3344556677', 400000, 4.9, 'portal_freelancer_004')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample clients
INSERT INTO clients (id, name, email, phone, instagram, since, status, client_type, portal_access_id) VALUES
('client_001', 'John & Jane Wedding', 'john.jane@example.com', '+6281234567894', '@johnjane_wedding', '2024-01-15', 'Aktif', 'Langsung', 'portal_client_001'),
('client_002', 'PT. Teknologi Maju', 'contact@teknologimaju.com', '+6281234567895', '@teknologi_maju', '2024-02-20', 'Aktif', 'Langsung', 'portal_client_002'),
('client_003', 'Sarah & David', 'sarah.david@example.com', '+6281234567896', '@sarahdavid_couple', '2024-03-10', 'Aktif', 'Langsung', 'portal_client_003')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample projects
INSERT INTO projects (
  id, project_name, client_name, client_id, project_type, package_name, package_id,
  date, location, progress, status, total_cost, amount_paid, payment_status,
  team, notes
) VALUES
(
  'project_001',
  'Wedding John & Jane',
  'John & Jane Wedding',
  'client_001',
  'Pernikahan',
  'Paket Premium Wedding',
  'pkg_002',
  '2024-06-15',
  'Ballroom Hotel Mulia, Jakarta',
  75,
  'Editing',
  15000000,
  7500000,
  'DP Terbayar',
  '[{"memberId": "team_001", "name": "Ahmad Rizki", "role": "Fotografer Senior", "fee": 800000, "reward": 100000}]'::jsonb,
  'Wedding outdoor dengan tema garden party'
),
(
  'project_002',
  'Corporate Event PT. Teknologi Maju',
  'PT. Teknologi Maju',
  'client_002',
  'Corporate Event',
  'Paket Basic Wedding',
  'pkg_001',
  '2024-05-20',
  'Convention Center Jakarta',
  100,
  'Selesai',
  8500000,
  8500000,
  'Lunas',
  '[{"memberId": "team_002", "name": "Sari Indah", "role": "Videografer", "fee": 1000000, "reward": 150000}]'::jsonb,
  'Event peluncuran produk baru'
)
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample transactions
INSERT INTO transactions (id, date, description, amount, type, project_id, category, method, card_id) VALUES
('txn_001', '2024-01-15', 'DP Wedding John & Jane', 7500000, 'Pemasukan', 'project_001', 'DP Proyek', 'Transfer Bank', 'card_001'),
('txn_002', '2024-02-20', 'Pelunasan Corporate Event', 8500000, 'Pemasukan', 'project_002', 'Pelunasan Proyek', 'Transfer Bank', 'card_001'),
('txn_003', '2024-03-01', 'Gaji Ahmad Rizki', 800000, 'Pengeluaran', 'project_001', 'Gaji Freelancer', 'Transfer Bank', 'card_001'),
('txn_004', '2024-03-01', 'Pembelian Lensa Baru', 5000000, 'Pengeluaran', NULL, 'Peralatan', 'Transfer Bank', 'card_002')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample leads
INSERT INTO leads (id, name, contact_channel, location, status, date, notes) VALUES
('lead_001', 'Michael & Lisa', 'Instagram', 'Bandung', 'Sedang Diskusi', '2024-04-01', 'Tertarik paket prewedding, budget sekitar 3-4 juta'),
('lead_002', 'CV. Sukses Bersama', 'WhatsApp', 'Surabaya', 'Menunggu Follow Up', '2024-04-05', 'Butuh dokumentasi event company gathering'),
('lead_003', 'Rina Birthday', 'Website', 'Jakarta', 'Sedang Diskusi', '2024-04-10', 'Sweet 17 party, tema princess')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample assets
INSERT INTO assets (id, name, category, purchase_date, purchase_price, status, notes) VALUES
('asset_001', 'Canon EOS R5', 'Kamera', '2023-01-15', 65000000, 'Tersedia', 'Kamera utama untuk wedding'),
('asset_002', 'Sony FX3', 'Kamera', '2023-03-20', 45000000, 'Digunakan', 'Kamera video profesional'),
('asset_003', 'Godox AD600Pro', 'Lighting', '2023-02-10', 8500000, 'Tersedia', 'Flash studio portable'),
('asset_004', 'MacBook Pro M2', 'Komputer', '2023-06-01', 35000000, 'Digunakan', 'Untuk editing video')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample promo codes
INSERT INTO promo_codes (id, code, discount_type, discount_value, is_active, usage_count, max_usage, expiry_date) VALUES
('promo_001', 'NEWCLIENT2024', 'percentage', 10, true, 5, 50, '2024-12-31'),
('promo_002', 'EARLYBIRD', 'fixed', 500000, true, 2, 20, '2024-08-31'),
('promo_003', 'REFERRAL', 'percentage', 15, true, 8, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample SOPs
INSERT INTO sops (id, title, category, content) VALUES
('sop_001', 'Prosedur Pemotretan Wedding', 'Fotografi', 'PERSIAPAN SEBELUM ACARA:\n1. Cek semua peralatan 1 hari sebelumnya\n2. Charge semua baterai dan siapkan backup\n3. Format memory card dan pastikan kapasitas cukup\n4. Review rundown acara dengan klien\n\nHARI PELAKSANAAN:\n1. Datang 30 menit sebelum jadwal\n2. Setup peralatan dan test lighting\n3. Koordinasi dengan WO dan vendor lain\n4. Dokumentasi sesuai shot list yang telah dibuat\n\nSETELAH ACARA:\n1. Backup semua file ke 2 storage berbeda\n2. Buat preview 20-30 foto untuk klien\n3. Kirim preview dalam 24 jam\n4. Mulai proses editing sesuai timeline'),
('sop_002', 'Standar Editing Foto Wedding', 'Editing', 'SELEKSI FOTO:\n1. Pilih foto terbaik dari setiap momen penting\n2. Hindari foto blur, mata tertutup, atau ekspresi buruk\n3. Pastikan variasi angle dan komposisi\n4. Target: 300-500 foto untuk paket premium\n\nEDITING PROCESS:\n1. Color correction dan white balance\n2. Exposure adjustment\n3. Skin retouching natural\n4. Background cleanup jika diperlukan\n5. Consistent color grading sesuai mood\n\nQUALITY CHECK:\n1. Review semua foto sebelum export\n2. Pastikan resolusi dan format sesuai standar\n3. Watermark pada preview, tanpa watermark untuk final\n4. Organize dalam folder sesuai kategori acara')
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();

-- Insert sample notifications
INSERT INTO notifications (id, title, message, timestamp, is_read, icon, link_view, link_action) VALUES
('notif_001', 'Proyek Baru Ditambahkan', 'Wedding John & Jane telah dikonfirmasi untuk tanggal 15 Juni 2024', now() - interval '2 hours', false, 'lead', 'Proyek', '{"type": "VIEW_PROJECT_DETAILS", "id": "project_001"}'::jsonb),
('notif_002', 'Deadline Mendekat', 'Editing untuk Corporate Event PT. Teknologi Maju harus selesai dalam 3 hari', now() - interval '1 day', false, 'deadline', 'Proyek', '{"type": "VIEW_PROJECT_DETAILS", "id": "project_002"}'::jsonb),
('notif_003', 'Pembayaran Diterima', 'DP sebesar Rp 7.500.000 telah diterima dari John & Jane Wedding', now() - interval '3 days', true, 'payment', 'Keuangan', '{}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();