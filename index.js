document.addEventListener('DOMContentLoaded', function() {

    let rainbowRule = Bindery.createRule({
        eachPage: function(page, book) {
          if (page.number >= 11 && page.number <= 141) {
            let pct = page.number / book.pageCount;
            page.background.style.backgroundColor = "hsl(" + (pct * 360) + ", 60%, 80%)";
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
        margin: { top: '12mm', inner: '12mm', outer: '10mm', bottom: '5mm' },
      },
      printSetup: {
        layout: Bindery.Layout.PAGES,
        paper: Bindery.Paper.AUTO_MARKS,
        marks: Bindery.Marks.CROP,
        bleed: '5mm',
      },
      rules: [
        rainbowRule,
        Bindery.PageBreak({ selector: 'h2', position: 'avoid' }),
        Bindery.PageBreak({ selector: '.page-break', position: 'after' }),
        Bindery.PageBreak({ selector: '.back-cover', position: 'before' }),
        Bindery.FullBleedSpread({ selector: '.spread', continue: 'same' }),
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
          selector: 'p > a',
          render: (element, number) => {
            return '<i>' + number + '</i>: Link to ' + element.href;
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