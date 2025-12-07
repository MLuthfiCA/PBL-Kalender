
function openEditModal(id, tanggal, isiCatatan) {
    // ambil elemen modal
    const modal = document.getElementById('editModal');
    
    // berikan nilai pada input di dalam modal
    document.getElementById('editCatatanId').value = id;
    document.getElementById('editTanggal').value = tanggal;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = isiCatatan;
    
    // masukan teks bersih ke textarea
    document.getElementById('editCatatan').value = tempDiv.textContent;
    
    // tampilkan modal
    modal.style.display = 'block';
}

function closeEditModal() {
    // ambil elemen modal
    const modal = document.getElementById('editModal');
    
    // sembunyikan modal
    modal.style.display = 'none';
    
    // reset nilai input di dalam modal
    document.getElementById('editCatatanId').value = '';
}

// nutup modal saat klik di luar modal
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeEditModal();
    }
}