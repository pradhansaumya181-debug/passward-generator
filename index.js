const sets = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      digits: '0123456789',
      symbols: '!@#$%^&*()-_=+[]{};:,.<>?/|~'
    }

    // elements
    const out = document.getElementById('passwordOutput');
    const lengthRange = document.getElementById('lengthRange');
    const lengthVal = document.getElementById('lengthVal');
    const lowerBox = document.getElementById('lowerCase');
    const upperBox = document.getElementById('upperCase');
    const numBox = document.getElementById('numbers');
    const symBox = document.getElementById('symbols');
    const genBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const preview = document.getElementById('previewP');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');

    function secureRandomInt(max){
      // return 0..max-1 using crypto
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }

    function generatePassword(length){
      let pool = '';
      if(lowerBox.checked) pool += sets.lower;
      if(upperBox.checked) pool += sets.upper;
      if(numBox.checked) pool += sets.digits;
      if(symBox.checked) pool += sets.symbols;

      if(!pool) return '';

      // ensure at least one of each selected type appears
      const required = [];
      if(lowerBox.checked) required.push(randomChar(sets.lower));
      if(upperBox.checked) required.push(randomChar(sets.upper));
      if(numBox.checked) required.push(randomChar(sets.digits));
      if(symBox.checked) required.push(randomChar(sets.symbols));

      const pw = [];
      // fill with random chars
      for(let i=0;i<length;i++) pw.push(randomChar(pool));

      // replace first few positions to guarantee required types (shuffle later)
      for(let i=0;i<required.length && i<pw.length;i++) pw[i] = required[i];

      // shuffle securely
      shuffleArray(pw);
      return pw.join('');
    }

    function randomChar(str){
      return str[secureRandomInt(str.length)];
    }

    function shuffleArray(arr){
      for(let i=arr.length-1;i>0;i--){
        const j = secureRandomInt(i+1);
        [arr[i],arr[j]] = [arr[j],arr[i]];
      }
    }

    function evaluateStrength(pw){
      let score = 0;
      if(pw.length >= 8) score += 1;
      if(pw.length >= 12) score += 1;
      if(/[a-z]/.test(pw)) score += 1;
      if(/[A-Z]/.test(pw)) score += 1;
      if(/[0-9]/.test(pw)) score += 1;
      if(/[^A-Za-z0-9]/.test(pw)) score += 1;
      return score; // 0..6
    }

    function updateStrengthUI(pw){
      const score = evaluateStrength(pw);
      const pct = Math.min(100, Math.round((score/6)*100));
      strengthBar.style.width = pct + '%';
      let label = 'Very weak';
      if(score <= 1) label = 'Very weak';
      else if(score <= 2) label = 'Weak';
      else if(score <= 3) label = 'Medium';
      else if(score <= 4) label = 'Strong';
      else label = 'Very strong';
      strengthLabel.textContent = label;
    }

    // UI events
    lengthRange.addEventListener('input', ()=>{lengthVal.textContent = lengthRange.value});

    genBtn.addEventListener('click', ()=>{
      const len = parseInt(lengthRange.value,10);
      const pw = generatePassword(len);
      out.value = pw || 'Please select at least one character set';
      preview.textContent = pw ? pw : 'No password generated';
      updateStrengthUI(pw);
    });

    copyBtn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(out.value);
        copyBtn.textContent = 'Copied!';
        setTimeout(()=>copyBtn.textContent = 'Copy',1200);
      }catch(e){
        copyBtn.textContent = 'Failed';
        setTimeout(()=>copyBtn.textContent = 'Copy',1200);
      }
    });

    saveBtn.addEventListener('click', ()=>{
      const blob = new Blob([out.value], {type:'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'password.txt';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    resetBtn.addEventListener('click', ()=>{
      lengthRange.value = 16; lengthVal.textContent = 16;
      lowerBox.checked = true; upperBox.checked = true; numBox.checked = true; symBox.checked = false;
      out.value = 'Your secure password will appear here'; preview.textContent='No preview yet'; updateStrengthUI('');
    });

    shuffleBtn.addEventListener('click', ()=>{
      const cur = out.value;
      if(!cur) return;
      const arr = cur.split(''); shuffleArray(arr); out.value = arr.join(''); preview.textContent = out.value; updateStrengthUI(out.value);
    });

    // init
    updateStrengthUI('');
