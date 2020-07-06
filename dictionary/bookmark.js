// generate
{
   let ready = true;
   let all = [];
   const format = (method) => {
      method = method
         .replace(/(\u200b)/g, '')
         .replace(/(String)/g, 'string')
         .replace(/(Object)/g, 'JavaObject')
         .replace(/(\@NotNull |\@Nullable |\@org\.jetbrains\.annotations\.NotNull )/g, '')
         .replace(/(\(| )(int|short|long|double|byte|float)( )/g, ' number ')
         .slice(0, -1)
         .trim()
         .split('(');
      if (method[1]) {
         method[1] = method[1]
            .split(', ')
            .map((arg) => {
               arg = arg.replace(/(\u00a0\>)/g, '>').replace(/(\.\.\.\u00a0)/g, '\u00a0...').split('\u00a0');
               arg[1] = arg[1].split('').map((at) => (at !== at.toLowerCase() ? '_' + at.toLowerCase() : at)).join('');
               return arg.reverse().join(':').replace(/(function\:)/g, 'funktion:');
            })
            .join(',');
      }
      return `${method[0]}(${method[1]})`;
   };
   Object.values($('table.memberSummary tr[class$="Color"][id]')).map((row) => {
      let type = $('.colFirst code', row)[0];
      let method = $('.colSecond code', row)[0];
      if (!ready || !type || !method) return (ready = false);
      type = type.innerText
         .replace(/(String)/g, 'string')
         .replace(/(Object)/g, 'JavaObject')
         .replace(/(\@NotNull |\@Nullable |\@org\.jetbrains\.annotations\.NotNull |default )/g, '')
         .replace(/(int|short|long|double|byte|float)/g, 'number')
         .trim();
      method = format(method.innerText);
      if (type.startsWith('static')) {
         type = type.slice(7);
         method = 'static ' + method;
      }
      if (type.startsWith('<')) {
         method = method.split('(');
         method[0] += type.split('>')[0] + '>';
         method = method.join('(');
         type = type.split('>').slice(1).join('>');
      }
      all.push((method + ':' + type).replace(/(\? super |\? extends |\<\?\>)/g, ''));
   });
   let exp = 'export ';
   let inum = '';
   let title = $('h2.title')[0].innerText.split(' ');
   title[0] = title[0].toLowerCase();
   let ext = $('.blockList pre')[0].innerText.split('\n')[1];
   ext = ext ? ` ${ext.split(', ').join(',')}` : '';
   let int = $('.blockList pre')[0].innerText.split('\n')[2];
   int = int ? ` ${int.split(', ').join(',')}` : '';
   let cst = [ ...document.querySelectorAll('.colConstructorName code') ].map((entry) => {
      entry = entry.innerText.split('(');
      entry[0] = 'constructor';
      return format(entry.join('(').replace(/(\(| )(int|short|long|double|byte|float)(\u00a0)/g, ' number\u00a0'));
   });
   if (title[0] === 'enum') {
      inum = `export enum ${title[1]}`;
      const members = [ ...document.querySelectorAll('.colFirst[scope="row"]') ].map((item) => {
         return `${item.innerText}=${title[1]}$Member`;
      });
      inum = `${inum}{${members.join(',')}}`;
      title = [ 'class', `${title[1]}$Member` ];
      exp = '';
   }
   const length = Number(sessionStorage.getItem('~~length') || 0);
   const header = `${exp}${title.join(' ')}${ext}${int}`;
   const methods = [ ...cst, ...all ].join(';') + ';';
   sessionStorage.setItem(`~~export${length}`, `${inum}${header}{${methods}}`);
   sessionStorage.setItem('~~length', `${length + 1}`);
}

// clear
{
   const length = Number(sessionStorage.getItem('~~length') || 0);
   let index = 0;
   while (index < length) {
      sessionStorage.removeItem(`~~export${index + 1}`);
      ++index;
   }
   sessionStorage.setItem('~~length', '0');
}

// view
{
   const length = Number(sessionStorage.getItem('~~length') || 0);
   const defs = [];
   let index = 0;
   while (index < length) {
      defs.push(sessionStorage.getItem(`~~export${index}`));
      ++index;
   }
   prompt('TypeScript Definitions:', defs.join(''));
   throw '';
}
