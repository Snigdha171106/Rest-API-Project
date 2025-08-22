const $ = (id)=>document.getElementById(id);
const api = '/api/books';

async function fetchJSON(url, options={}){
  const res = await fetch(url, {headers:{'Content-Type':'application/json'}, ...options});
  if(!res.ok && res.status!==204){
    const err = await res.json().catch(()=>({error:res.statusText}));
    throw new Error(err.error||res.statusText);
  }
  return res.status===204 ? null : res.json();
}

async function loadBooks(q=''){
  const data = await fetchJSON(q ? `${api}?q=${encodeURIComponent(q)}` : api);
  const tbody = document.querySelector('#books-table tbody'); tbody.innerHTML='';
  data.forEach(b=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Title">${b.title}</td>
      <td data-label="Author">${b.author}</td>
      <td data-label="ISBN">${b.isbn}</td>
      <td data-label="Price">${Number(b.price).toFixed(2)}</td>
      <td data-label="Stock">${b.stock}</td>
      <td data-label="Actions">
        <button onclick="editBook(${b.id})">Edit</button>
        <button class="secondary" onclick="removeBook(${b.id})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function readForm(){
  return {
    title: $('title').value.trim(),
    author: $('author').value.trim(),
    isbn: $('isbn').value.trim(),
    price: parseFloat($('price').value||'0'),
    stock: parseInt($('stock').value||'0')
  };
}

function fillForm(b){
  $('book-id').value = b?.id||'';
  $('title').value = b?.title||'';
  $('author').value = b?.author||'';
  $('isbn').value = b?.isbn||'';
  $('price').value = b?.price||'';
  $('stock').value = b?.stock||'';
  $('form-title').textContent = b ? 'Edit Book' : 'Add Book';
  $('cancel').hidden = !b;
}

async function editBook(id){
  const b = await fetchJSON(`${api}/${id}`);
  fillForm(b);
}

async function removeBook(id){
  if(!confirm('Delete this book?')) return;
  await fetchJSON(`${api}/${id}`, {method:'DELETE'});
  await loadBooks($('search').value);
  fillForm(null);
}

$('book-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const id = $('book-id').value;
  const body = JSON.stringify(readForm());
  if(id){
    await fetchJSON(`${api}/${id}`, {method:'PUT', body});
  }else{
    await fetchJSON(api, {method:'POST', body});
  }
  await loadBooks($('search').value);
  fillForm(null);
});

$('cancel').addEventListener('click', ()=> fillForm(null));
$('search').addEventListener('input', (e)=> loadBooks(e.target.value));

loadBooks();
