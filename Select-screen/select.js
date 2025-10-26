// Initialize Supabase
const SUPABASE_URL = 'https://wyrvxgzuboobnrbzeshx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cnZ4Z3p1Ym9vYm5yYnplc2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NTc0MjQsImV4cCI6MjA3NzAzMzQyNH0.MhmWMNpI1fsaLB5qQm0zFOOMLx13CJJMbfJW-cuUuNA';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Create a new study set
async function createSet() {
  const setName = document.getElementById('newSetName').value.trim();
  if (!setName) return alert('Please enter a set name.');

  const { error } = await client.from('sets').insert([{ name: setName }]);
  if (error) {
    console.error('Error creating set:', error);
    alert('Error creating set.');
    return;
  }

  alert('Set created!');
  document.getElementById('newSetName').value = '';
  loadSets();
}

// 📚 Load all sets
async function loadSets() {
  const { data, error } = await client
    .from('sets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading sets:', error);
    return;
  }

  const setList = document.getElementById('setList');
  const setSelect = document.getElementById('setSelect');
  setList.innerHTML = '';
  setSelect.innerHTML = '';

  data.forEach(set => {
    const li = document.createElement('li');
    li.textContent = set.name;
    li.onclick = () => loadCards(set.id);
    setList.appendChild(li);

    const option = document.createElement('option');
    option.value = set.id;
    option.textContent = set.name;
    setSelect.appendChild(option);
  });
}

// 🪄 Add a card (question + correct + incorrect answers)
async function addQuestion() {
  const setId = document.getElementById('setSelect').value;
  const question = document.getElementById('questionInput').value.trim();
  const answer = document.getElementById('answerInput').value.trim();
  const wrong1 = document.getElementById('wrong1Input').value.trim();
  const wrong2 = document.getElementById('wrong2Input').value.trim();

  if (!setId || !question || !answer || !wrong1 || !wrong2) {
    alert('Please fill in all fields.');
    return;
  }

  // Create array of incorrect answers
  const incorrect_answers = [wrong1, wrong2];

  const { error } = await client
    .from('cards')
    .insert([{ set_id: setId, question, answer, incorrect_answers }]);

  if (error) {
    console.error('Error adding question:', error);
    alert('Error adding question.');
    return;
  }

  // Clear inputs
  document.getElementById('questionInput').value = '';
  document.getElementById('answerInput').value = '';
  document.getElementById('wrong1Input').value = '';
  document.getElementById('wrong2Input').value = '';

  // Reload cards
  loadCards(setId);
}




// 🃏 Load cards for selected set
async function loadCards(setId) {
  const { data, error } = await client
    .from('cards')
    .select('*')
    .eq('set_id', setId)
    .order('created_at', { ascending: true });

  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';

  if (error) {
    console.error('Error loading cards:', error);
    return;
  }

  if (!data.length) {
    container.innerHTML = '<p style="color:white">No cards yet for this set.</p>';
    return;
  }

  data.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>Q:</strong> ${card.question}<br>
      <em>Correct:</em> ${card.answer}<br>
      <em>Incorrect:</em> ${card.incorrect_answers?.join(', ') || 'None'}
    `;
    container.appendChild(div);
  });
}

// 🔙 Dummy go back (replace this later)
function goBack() {
  alert('Back to main menu (replace this function)');
}

// 🏁 Load sets when page loads
window.onload = loadSets;
