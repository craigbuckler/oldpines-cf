// navigation functions
import { tacs } from 'publican';

// nested main menu navigation
// pass current page and array of child directories to omit from navigation
export function menuMain( currentPage, maxLevel = Infinity, omit = [] ) {

  return '<ul>' + recurseNav( tacs.nav ) + '</ul>';

  function recurseNav(nav, level = 0) {

    return nav.map(n => {

      // format title
      const data = n.data;

      if (data.menu === false) return '';

      let ret = data.menu || data.title;
      if (!data.link) {
        ret = ret.slice(0, 1).toUpperCase() + ret.slice(1).toLowerCase();
      }
      else {
        if (currentPage === data.link) ret = `<strong>${ ret }</strong>`;
        else ret = `<a href="${ data.link }">${ ret }</a>`;
      }

      // get children
      const children = omit.includes( data.directory ) || level + 1 >= maxLevel ? null : recurseNav( n.children, level+1 ).trim();

      if (children) {
        ret = `\n${ ret }\n<ul>\n${ children }</ul>\n</details>\n`;
      }

      return data.link || children ? `<li>${ ret }</li>\n` : '';

    }).join('\n');

  }

}


// menu for a specific directory
export function menuDir( currentPage, rootDir ) {

  if (!rootDir) return;

  const nav = recurseNav( tacs.nav );
  return nav.includes('</li>') ? '<ul>' + recurseNav( tacs.nav ) + '</ul>' : '';

  function recurseNav(nav, dirFound) {

    return nav.map(n => {

      // format title
      const data = n.data;

      if (data.menu === false || (!dirFound && data.directory !== rootDir)) return '';

      let ret = data.menu || data.title;
      if (!data.link) {
        ret = ret.slice(0, 1).toUpperCase() + ret.slice(1).toLowerCase();
      }
      else {
        if (currentPage === data.link) ret = `<strong>${ ret }</strong>`;
        else if (data.index !== false) ret = `<a href="${ data.link }">${ ret }</a>`;
      }

      // get children
      const children = recurseNav( n.children, true ).trim();

      if (children) {
        ret = dirFound ? `\n<details open>\n<summary>${ ret }</summary>\n<ul>\n${ children }</ul>\n</details>\n` : children;
      }

      return dirFound ? `<li>${ ret }</li>\n` : ret;

    }).join('\n');

  }

}


// breadcrumb navigation
export function breadcrumb( currentPage ) {

  const crumb = [];
  recurseNav( tacs.nav );

  const ret = crumb
    .map(n => `<li>${ n.link && n.index ? `<a href="${ n.link }">` : ''}${ n.menu || n.title }${ n.link && n.index ? '</a>' : ''}</li>`)
    .join('\n');

  return ret ? `<nav class="breadcrumb">\n<ol>\n${ ret }</ol>\n</nav>` : '';

  function recurseNav(nav) {

    let found;

    nav.forEach(n => {

      found = found || currentPage === n.data.link;

      if (!found) {
        found = recurseNav(n.children);
        if (found) crumb.unshift(n.data);
      }

    });

    return found;

  }

}


// site tag list
export function tagList(classPrefix = 'taglist', classMin = 1, classMax = 5) {

  if (!tacs?.tagList?.length) return;

  const
    minCount = tacs.tagList.at(-1).count,
    maxCount = tacs.tagList.at(0).count,
    rangeCount = maxCount - minCount;

  let ret = tacs.tagList.map(i => {

    const classNum = Math.round(((i.count - minCount) / rangeCount) * (classMax - classMin)) + classMin;
    return `<li class="${ classPrefix + classNum }"><a href="${ i.link }">${ i.tag } <sup>${ i.count }</sup></a></li>`;

  }).join('\n');

  if (ret) ret = `<nav class="${ classPrefix }"><ul>\n${ ret }\n</ul></nav>`;

  return ret;

};


// paged navigation
export function pagination( pagination ) {

  if (!(pagination?.href?.length > 1)) return;

  const
    pt = pagination.pageTotal,
    pc = pagination.pageCurrent;

  let ret = '', last = 0;

  // back
  ret += `<li class="back">${ pagination.hrefBack ? `<a href="${ pagination.hrefBack }" title="previous index page">` : '<span>' }&#9668;${ pagination.hrefBack ? '</a>' : '</span>' }</li>\n`;

  pagination.href.forEach((page, pIdx)  => {

    const
      maxp = pc === 0 || pc + 1 === pt ? 3 : 2,
      current = pIdx === pc;

    if (current || pIdx === 0 || pIdx + 1 === pt || pt < 7 || (pIdx + maxp > pc && pIdx - maxp < pc)) {

      last = pIdx;
      if (current) {
        ret += `<li class="current"><strong>${ pIdx + 1 }</strong></li>`;
      }
      else {
        ret += `<li><a href="${ page }">${ pIdx + 1 }</a></li>`;
      }

    }
    else {

      if (last + 1 === pIdx) {
        ret += '<li class="gap">&hellip;</li>';
      }

    }

  });


  // next
  ret += `<li class="next">${ pagination.hrefNext ? `<a href="${ pagination.hrefNext }" title="next index page">` : '<span>' }&#9658;${ pagination.hrefNext ? '</a>' : '</span>' }</li>\n`;

  return `<nav class="pagination"><ul>${ ret }</ul></nav>`;

}
