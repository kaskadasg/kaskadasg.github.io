document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resultDiv = document.getElementById('formResult');

  if (!form) return;

  const fields = {
    vardas: document.getElementById('vardas'),
    pavarde: document.getElementById('pavarde'),
    elPastas: document.getElementById('elPastas'),
    telefonas: document.getElementById('telefonas'),
    adresas: document.getElementById('adresas'),
    klausimas1: document.getElementById('klausimas1'),
    klausimas2: document.getElementById('klausimas2'),
    klausimas3: document.getElementById('klausimas3')
  };

  const sliderKeys = ['klausimas1', 'klausimas2', 'klausimas3'];

  // Atnaujina skaičių šalia slankiklio (pvz., "1 / 10")
  function updateSliderLabels() {
    sliderKeys.forEach((key) => {
      const input = fields[key];
      const labelEl = document.getElementById(`${key}Val`);
      if (input && labelEl) {
        labelEl.textContent = `${input.value} / 10`;
      }
    });
  }

  // Klaidų pranešimų ir raudono apvado valdymas
  function setError(input, message) {
    const errorEl = input.parentElement.querySelector('.error-msg');
    if (message) {
      input.style.borderColor = '#dc3545';
      input.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
      return false;
    } else {
      input.style.borderColor = '';
      input.classList.remove('is-invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  // Vieno lauko validacija
  function validateField(key) {
    const input = fields[key];
    if (!input) return true;

    const val = input.value.trim();

    if (!val) {
      return setError(input, 'Šis laukas yra privalomas.');
    }

    if (key === 'vardas' || key === 'pavarde') {
      const lettersOnlyRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/;
      if (!lettersOnlyRegex.test(val)) {
        return setError(input, 'Lauke gali būti tik raidės.');
      }
    }

    if (key === 'elPastas') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        return setError(input, 'Įveskite teisingą el. pašto adresą.');
      }
    }

    if (key === 'telefonas') {
      const phoneRegex = /^\+370 6\d{2} \d{5}$/;
      if (!phoneRegex.test(val)) {
        return setError(input, 'Numerio formatas turi būti +370 6xx xxxxx.');
      }
    }

    if (sliderKeys.includes(key)) {
      const num = Number(val);
      if (Number.isNaN(num) || num < 1 || num > 10) {
        return setError(input, 'Įvertinimas turi būti nuo 1 iki 10.');
      }
    }

    return setError(input, '');
  }

  // Patikrina, ar visi laukai validūs, ir atnaujina "Siųsti" mygtuko būseną
  function updateSubmitButtonState() {
    if (!submitBtn) return;

    let allValid = true;
    for (const key of Object.keys(fields)) {
      const input = fields[key];
      if (!input || !input.value.trim() || input.classList.contains('is-invalid')) {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      for (const key of Object.keys(fields)) {
        if (!validateField(key)) {
          allValid = false;
          break;
        }
      }
    }

    submitBtn.disabled = !allValid;
  }

  // Telefono numerio formatavimas realiu laiku į +370 6xx xxxxx
  if (fields.telefonas) {
    fields.telefonas.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '');

      if (digits.startsWith('86')) {
        digits = '370' + digits.slice(1);
      } else if (digits.startsWith('6')) {
        digits = '370' + digits;
      } else if (digits.length > 0 && !digits.startsWith('370')) {
        digits = '370' + digits;
      }

      digits = digits.slice(0, 11);

      let formatted = '';
      if (digits.length > 0) {
        formatted = '+' + digits.slice(0, 3);
      }
      if (digits.length > 3) {
        formatted += ' ' + digits.slice(3, 6);
      }
      if (digits.length > 6) {
        formatted += ' ' + digits.slice(6, 11);
      }

      e.target.value = formatted;
      validateField('telefonas');
      updateSubmitButtonState();
    });
  }

  // Realaus laiko validacija ir slankiklių reikšmių atnaujinimas
  for (const key of Object.keys(fields)) {
    if (key !== 'telefonas' && fields[key]) {
      fields[key].addEventListener('input', () => {
        if (sliderKeys.includes(key)) {
          updateSliderLabels();
        }
        validateField(key);
        updateSubmitButtonState();
      });
    }
  }

  // Pradinė būsena
  updateSliderLabels();
  updateSubmitButtonState();

  // Formos pateikimas
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    for (const key of Object.keys(fields)) {
      if (!validateField(key)) {
        isFormValid = false;
      }
    }
    updateSubmitButtonState();
    if (!isFormValid) return;

    const vardas = fields.vardas.value.trim();
    const pavarde = fields.pavarde.value.trim();
    const elPastas = fields.elPastas.value.trim();
    const telefonas = fields.telefonas.value.trim();
    const adresas = fields.adresas.value.trim();
    const klausimas1 = Number(fields.klausimas1.value);
    const klausimas2 = Number(fields.klausimas2.value);
    const klausimas3 = Number(fields.klausimas3.value);

    const formData = {
      vardas,
      pavarde,
      elPastas,
      telefonas,
      adresas,
      klausimas1,
      klausimas2,
      klausimas3
    };

    console.log('Formos objektas:', formData);

    const vidurkis = ((klausimas1 + klausimas2 + klausimas3) / 3).toFixed(2);

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <p class="mb-1"><strong>Vardas:</strong> ${vardas}</p>
      <p class="mb-1"><strong>Pavardė:</strong> ${pavarde}</p>
      <p class="mb-1"><strong>El. paštas:</strong> <a href="mailto:${elPastas}">${elPastas}</a></p>
      <p class="mb-1"><strong>Tel. Numeris:</strong> ${telefonas}</p>
      <p class="mb-1"><strong>Adresas:</strong> ${adresas}</p>
      <p class="mb-1"><strong>1 klausimas (1–10):</strong> ${klausimas1}</p>
      <p class="mb-1"><strong>2 klausimas (1–10):</strong> ${klausimas2}</p>
      <p class="mb-3"><strong>3 klausimas (1–10):</strong> ${klausimas3}</p>
      <hr>
      <p class="mb-0"><strong>${vardas} ${pavarde}:</strong> ${vidurkis}</p>
    `;
  });

  // Mygtukas "Išvalyti"
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();

      // Grąžiname slankiklius į 1 (kairę) ir atnaujiname jų žymes
      sliderKeys.forEach((key) => {
        if (fields[key]) {
          fields[key].value = 1;
        }
      });
      updateSliderLabels();

      for (const key of Object.keys(fields)) {
        if (fields[key]) {
          setError(fields[key], '');
        }
      }

      if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
      }

      updateSubmitButtonState();
    });
  }
});