document.addEventListener('DOMContentLoaded', function() {

  let rainbowRule = Bindery.createRule({
      eachPage: function(page, book) {
        if (page.number >= 21 && page.number <= 141) {
          let pct = page.number / book.pageCount;
          page.background.style.backgroundColor = "hsl(" + (pct * 360) + ", 60%, 80%)";
        }
      }
    });
  
  let black = Bindery.createRule({
      eachPage: function(page, book) {
        if (page.number === 3 || page.number === 16 || page.number === 17) {
          page.background.style.backgroundColor = "#0a0b0c";
        }
      }
    });

  Bindery.makeBook({
    content: {
      selector: '#content',
      url: './content.html',
    },
    pageSetup: {
      size: { width: '110mm', height: '180mm' },
      margin: { top: '12mm', inner: '10mm', outer: '10mm', bottom: '7mm' },
    },
    printSetup: {
      layout: Bindery.Layout.PAGES,
      paper: Bindery.Paper.AUTO_MARKS,
      marks: Bindery.Marks.CROP,
      bleed: '5mm',
    },
    rules: [
      rainbowRule,
      black,
      Bindery.PageBreak({ selector: 'h2', position: 'avoid' }),
      Bindery.PageBreak({ selector: '.page-break', position: 'after' }),
      Bindery.PageBreak({ selector: '.back-cover', position: 'before' }),
      Bindery.FullBleedSpread({ selector: '.spread', continue: 'same' }),
      Bindery.FullBleedPage({ selector: '.fullpage', continue: 'next' }),
      Bindery.RunningHeader({
        render: (page) => {
          const nullPageSelectors = [
            ".title-section"
          ];
          if (page.element.querySelector(".title-section")) return "";
          else if (page.isLeft) return `<span class="page-number">${page.number}—${page.heading.h1}</span>`;
          else if (page.isRight) return `<span class="page-number">${page.heading.h2}—${page.number}</span>`;
        },
      }),
      Bindery.Footnote({
        selector: '.note',
        render: (element, number) => {
          let footnote = element.getAttribute('footnote');
          return number + footnote;
        }
      }),
      Bindery.PageReference({
        selector: 'h2',
        replace: (element, number) => {
          let row = document.createElement('div');
          row.classList.add('toc-row');
          row.innerHTML = element.textContent;
          row.innerHTML += `<span class='num'>${number}</span>`;
          return row;
        }
      }),
      Bindery.Split({
        selector: 'li',
        toNext: 'to-next',
        fromPrevious: 'from-previous',
      }),
    ], 
  });

  

}, false);

  