<template>
  <div class="min-h-screen bg-white text-gray-800 flex flex-col">
    <!-- Header -->
    <header class="flex justify-between items-center px-6 py-4 border-b border-gray-300">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold">Puskesmas</h1>
      </div>
    </header>

    <!-- Konten Utama -->
    <main class="flex-grow flex flex-col justify-center px-4">
      <h2 class="text-3xl text-center font-bold mb-8">Silakan Ambil Nomor Antrian</h2>
      <div class="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div class="border rounded-xl shadow p-6 flex flex-col justify-between bg-blue-50">
          <h3 class="text-xl font-semibold text-center mb-4">Antrian Umum</h3>
           <button @click="ambilNomor('P')" class="bg-blue-600 text-white text-8xl py-10 rounded-lg shadow hover:bg-blue-700 transition">
            {{ `P-${counters.P}` }}
          </button>
        </div>
        <div class="border rounded-xl shadow p-6 flex flex-col justify-between bg-green-50">
          <h3 class="text-xl font-semibold text-center mb-4">Antrian Gigi</h3>
           <button @click="ambilNomor('Q')" class="bg-green-600 text-white text-8xl py-10 rounded-lg shadow hover:bg-green-700 transition">
            {{ `Q-${counters.Q}` }}
          </button>
        </div>
        <div class="border rounded-xl shadow p-6 flex flex-col justify-between bg-pink-50">
          <h3 class="text-xl font-semibold text-center mb-4">Antrian KIA</h3>
             <button @click="ambilNomor('R')" class="bg-pink-600 text-white text-8xl py-10 rounded-lg shadow hover:bg-pink-700 transition">
            {{ `R-${counters.R}` }}
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 bg-gray-100 text-center text-sm border-t border-gray-300">
      Informasi terkini
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const jenisAntrian = ref('');
const counters = reactive({ P: 0, Q: 0, R: 0 });

onMounted(() => {
  fetch('http://localhost:3000/api/counters')
    .then(res => res.json())
    .then(data => {
      Object.assign(counters, data);
    });
});

function ambilNomor(prefix) {
  jenisAntrian.value = prefix === 'P' ? 'Antrian Umum' : prefix === 'Q' ? 'Antrian Gigi' : 'Antrian KIA';
  fetch(`http://localhost:3000/api/ambil?prefix=${prefix}`)
    .then(res => res.json())
    .then(data => {
      const [, nomor] = data.nomor.split('-');
      counters[prefix] = Number(nomor);
      cetakStruk(data.nomor);
    });
}

function cetakStruk(nomor) {
  const printWindow = window.open('', '', 'width=400,height=300');
  printWindow.document.write(`
    <html>
    <head>
      <title>Struk Antrian</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="flex items-center justify-center h-screen">
      <div class="w-full max-w-sm p-4 border border-gray-300 rounded-xl shadow text-center">
        <div class="text-lg font-semibold text-gray-600 mb-2">${jenisAntrian.value}</div>
        <div class="text-8xl font-bold text-gray-800">${nomor}</div>
        <div class="mt-4 text-sm text-gray-500">Harap menunggu panggilan</div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
}
</style>
