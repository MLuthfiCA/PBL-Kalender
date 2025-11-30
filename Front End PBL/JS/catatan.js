/**
 * catatan.js
 * Menangani logika tampilan Modal Edit Catatan
 */

function openEditModal(id, tanggal, isiCatatan) {
    // 1. Ambil elemen modal
    const modal = document.getElementById('editModal');
    
    // 2. Bersihkan dan atur nilai
    document.getElementById('editCatatanId').value = id;
    document.getElementById('editTanggal').value = tanggal;
    
    // PENTING: Mendekode entitas HTML/JSON yang mungkin dibawa dari PHP
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = isiCatatan;
    
    // Masukkan teks murni ke textarea untuk diedit
    document.getElementById('editCatatan').value = tempDiv.textContent;
    
    // 3. Tampilkan modal
    modal.style.display = 'block';
}

function closeEditModal() {
    // 1. Ambil elemen modal
    const modal = document.getElementById('editModal');
    
    // 2. Sembunyikan modal
    modal.style.display = 'none';
    
    // 3. Reset nilai input hidden
    document.getElementById('editCatatanId').value = '';
}

// Menutup modal jika pengguna mengklik di luar area modal
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeEditModal();
    }
}