// variables start
var API_JOBS = "APIs/API-JOBS.php"
var API_CV = "APIs/API-CV.php"
// variables end



// helpers start
function toggler(thisId, nextId) {
    console.log(thisId, nextId)
    B8.remClass('u-none', B8.get('#' + nextId));
    B8.get('#' + thisId).style = "display:none";
}


function hideCv() {
    B8.addClass('u-none', B8.get('#jsMiniJobView'));
    B8.remClass('is-half', B8.get('#jsMainListingContainer'));
}


function removeLoading() {
    B8.addClass('progresor-progress-done', B8.get('.progresor-container'));
    setTimeout(() => {
        B8.remClasses(B8.get('.progresor-container'), 'progresor-progress', 'progresor-progress-done');
    }, 2000)
}


function findInUrl(findKey) {
    var urlHash = location.hash.split('#')[1];
    if (typeof urlHash !== 'undefined') {
        var key = '';
        urlHash = urlHash.split('&').filter(k => {
            key = k.split('=');
            if (key[0] == findKey) {
                return key
            }
        })
        return urlHash.length > 0 ? urlHash[0].split('=')[1] : false;
    }
}


isPage = param => {
    var urlReplace = location.hash.split('#')[1];
    if (typeof urlReplace !== 'undefined') {
        urlReplace = urlReplace.split('&');
        if (urlReplace.indexOf(param) == 1) {
            return true;
        } else {
            return false;
        }
    }
}


replaceUrl = (paramKey, paramValue) => {
    var urlReplace = location.hash.split('#')[1];
    if (typeof urlReplace !== 'undefined') {

        if (urlReplace.split('&') == urlReplace) {
            urlReplace = [urlReplace, paramKey + '=' + paramValue];
        } else {
            urlReplace = urlReplace.split('&')
        }

    }
    else {
        urlReplace = [paramKey + '=' + paramValue];
    }

    urlReplace = urlReplace.map(k => {
        var splits = k.split('=');
        splits[1] = splits[0] == paramKey ? paramValue : splits[1];
        return splits.join('=');
    })

    urlReplace = urlReplace.join('&');
    window.location.hash = urlReplace;
}


function mapToProp(data, prop) {
    return data
        .reduce((res, item) => Object
            .assign(res, {
                [item[prop]]: 1 + (res[item[prop]] || 0)
            }), Object.create(null))
        ;
}


function ageCounter(ages) {
    // age counter start
    var arr = Object.entries(ages);
    var l = arr.length;
    var c = 0, cc = 0, ccc = 0, num = 0;
    var allAges = [];
    for (const [k, v] of arr) {

        var multipleOf = Math.ceil((parseInt(k) + 1) / 10) * 10;

        if (num !== multipleOf - 10) {
            if (cc == l - 1) {
                ccc = ccc + v;
                allAges.push([num - 10 + ' to ' + num, ccc]);
                // console.log('if: ',  num - 10, num,ccc );
            }
        } else {
            allAges.push([num - 10 + ' to ' + num, ccc]);
            // allAges.push( num - 10 + ' to ' + num + ' ('+ ccc + ')');
            // console.log('else: ', num - 10 ,num, ccc);
            c = ccc = 0
        }

        ccc = ccc + v;
        cc++;
        var num = multipleOf;
    }
    return allAges;
    // age counter end
}
// helpers end

// Renderers Start
const sidebarRenderer = (Sidefor, arr, keyword) => {
    var sideStart = `<input
                     id="${Sidefor}"
                     class="accordion-toggle"
                     type="checkbox"
                     checked="checked"
                   />
                   <label
                     for="${Sidefor}"
                     class="accordion-title"
                     >${Sidefor}</label
                   >
                   <div class="accordion-animate">
                     <div class="accordion-content">
                       <ul
                         class="list is-basic is-spaced is-compact t-small m0"
                       >`
    var li = '';
    arr.forEach((v, i) => {

        if (i == 4) {
            li += (`</ul>
            <span id="${Sidefor + i}" onclick="toggler('${Sidefor + i}', '${Sidefor + i + i}')" ><a href="javascript:;" class="is-gray t-xsmall p0">
                <span>Show More</span>
           </a></span><ul id="${Sidefor + i + i}" class="list is-basic is-spaced is-compact t-small m0 u-none">`);
        }

        li += (`<li data-i='${i}' class="t-small">
                     <a
                       ${(Sidefor !== 'Age' ? `onclick="jobKeyword('${v[0]}')"` : '')}
                       href="javascript:;"
                       class="jsAjaxLoad"
                     >${v[0]}</a> &nbsp; <span class="t-mute">(${v[1]})</span>
                   </li>`);

    })


    var sideEnd = `</ul></div></div>`;

    return sideStart + li + sideEnd;
}

const mainContentRenderer = (arr) => {
    var li = '';
    arr.forEach((v) => {
        let { photo_url, cv_id, icode, first_name, last_name, age, experince_title } = v;
        li += (`<li>
                      <div>
                        <img src="${photo_url}"  class="img-70 u-right m10l" alt="${first_name + ' ' + last_name}" title="${first_name + ' ' + last_name}">
                        <h2 class="m0 t-regular">
                          <a onClick="viewCV('${cv_id}', '${icode}')" href="javascript:;">${first_name}</a>
                        </h2>
                        <div class="t-small">
                          <b class="p10r">${experince_title}</b> <span class="t-mute" title="Age: ${age}years">(${age})</span>									
                        </div>
                      </div>
                    </li>`)
    })
    return li
}

function cvContent(heading, obj, find) {
    let content = '';
    obj.forEach(k => {
        if (k[find] !== '') {
            content += '<div>' + k[find] + '</div>'
        }
    })

    if (content == '' || typeof content == 'undefined') {
        return '';
    }

    return `<h2 class="h6 p10t">${heading}</h2>
        ${content}
    `;
}

function cvHeader(obj) {
    let { photo_info, first_names, date_modified } = obj
    return `<img data-ssrc="assets/images/1x1.png" src="${photo_info}" alt="Bank of Jordan logo" title="Bank of Jordan logo" class="img-70 u-left-m">
    <div>
        <h2 class="t-large">${first_names}</h2>
        <ul class="list is-basic t-small">
            <li>
                <span class="p20l-d p10y-m u-block-m">
                    Date Posted: ${date_modified}			
                </span>
            </li>
        </ul>
    </div>
    `;
}
// Renderes end 


// Controllers start
function viewCV(cv_id, icode) {
    console.log('cv_id: ', cv_id, 'icode: ', icode);


    B8.ajax(API_CV + '/?cv_id=' + cv_id + '&icode=' + icode, { method: 'GET' }).success(function (data, xhr) {

        data = JSON.parse(data);
        console.log('cv:', data);
        window.cv = data;

        if (typeof data.cv_training == 'undefined') {
            alert(data.status)
            removeLoading();
            return
        }

        let { cv_training, cv_education, cv_hobbies, cv_memberships } = data
        let cv_training_values = Object.values(cv_training);
        let cv_education_values = Object.values(cv_education);
        let cv_hobbies_values = Object.values(cv_hobbies);
        let cv_memberships_values = Object.values(cv_memberships);

        let cv_training_type = cvContent('Training Type', cv_training_values, 'training_type');
        let cv_training_institute = cvContent('Institute', cv_training_values, 'institute');

        let cv_education_institution = cvContent('Education Institution', cv_education_values, 'institution');
        let cv_education_degree = cvContent('Education Degree', cv_education_values, 'degree');
        let cv_education_major = cvContent('Education Major', cv_education_values, 'major');

        let cv_hobbies_hobby = cvContent('Hobbies', cv_hobbies_values, 'hobby');
        let cv_hobbies_accomplishments = cvContent('Accomplishments', cv_hobbies_values, 'accomplishments');

        let cv_membership_organization = cvContent('Organization Name', cv_memberships_values, 'organization_name');
        let cv_membership_role = cvContent('Membership Role', cv_memberships_values, 'membership_role');
        var allhtml = cv_training_type + cv_training_institute + cv_education_institution + cv_education_degree + cv_education_major + cv_hobbies_hobby + cv_hobbies_accomplishments + cv_membership_organization + cv_membership_role;

        const parse = Range.prototype.createContextualFragment.bind(document.createRange());
        if (document.getElementById('cvHead') !== null) {
            document.getElementById('cvHead').remove()
        }
        if (document.getElementById('cvContentDetail_data') !== null) {
            document.getElementById('cvContentDetail_data').remove()
        }

        document.getElementById('cardHead').append(parse('<div class="media" id="cvHead">' + cvHeader(data) + '</div>'))
        document.getElementById('cvContentDetail').append(parse('<div id="cvContentDetail_data">' + allhtml + '</div>'))

        B8.remClass('u-none', B8.get('#jsMiniJobView'));
        B8.addClass('is-half', B8.get('#jsMainListingContainer'));
        removeLoading();
    }).error(function (xhr, reason) {
        alert('Oops! ' + reason + '.')
        console.log('Oops! ' + reason + '.');
        removeLoading();
    })
}


const pageRenderer = (API_JOBS, resetPage = false, paginate = false) => {
    B8.addClass('progresor-progress', B8.get('.progresor-container'));
    console.log('API_JOBS', API_JOBS);

    B8.ajax(API_JOBS, { method: 'GET' }).success(function (data, xhr) {

        if (data == '') {
            B8.get('body').innerHtml = 'Sorry Data not found';
            return;
        }

        data = JSON.parse(data);

        if (typeof data.result == 'undefined') {
            alert(data.status)
            removeLoading();
            return
        } else {
            var jobs = window.jobs;
            data = data.result;
            if (paginate) {
                data = jobs.concat(data);
            }
        }

        window.jobs = data;
        console.log('Jobs: ', data);

        let filterAges = mapToProp(data, 'age');
        let filterExp = Object.entries(mapToProp(data, 'experince_title'));
        filterAges = ageCounter(filterAges);

        let sidebar = sidebarRenderer('Age', filterAges, 'age') + sidebarRenderer('Experience', filterExp, 'experince_title');
        let mainContent = mainContentRenderer(data)

        document.getElementById('mainContent').innerHTML = mainContent
        document.getElementById('sideBar').innerHTML = sidebar;

        if (resetPage == true) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        B8.get('.loading-backdrop').style = 'display:none'
        B8.addClass('progresor-progress-done', B8.get('.progresor-container'));
        removeLoading();

    }).error(function (xhr, reason) {
        alert('Oops! ' + reason + '.')
        console.log('Oops! ' + reason + '.');
    });
}
// Controllers end

function hideJobKeyword() {
    B8.get('#SearchedContent').style = "display:none";
}

function jobKeyword(e) {
    let newJobs = window.jobs.filter((k, i) => {
        if (k.experince_title == e) {
            return k.cv_id
        }
    })
    let mainContent = mainContentRenderer(newJobs)

    B8.get('#SearchedContent').style = "display:block";
    document.getElementById('SearchedContent_h').innerHTML = 'Filtered: ' + e;
    document.getElementById('SearchedContent_ul').innerHTML = mainContent;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



// Triggers start
B8.ready(function () {

    var findInUrlVar = findInUrl('page');
    var page = (findInUrlVar ? findInUrlVar : 1);
    replaceUrl('page', page);

    findInUrlVar = findInUrl('position_keyword');
    findInUrlVar = (findInUrlVar ? findInUrlVar : B8.get('#filterSearchInput').value);
    B8.get('#filterSearchInput').value = decodeURIComponent(findInUrlVar)
    document.getElementById('searchedKeyWord').innerHTML = decodeURIComponent(findInUrlVar);

    replaceUrl('position_keyword', findInUrlVar);


    // FirstPaint of HomePage
    pageRenderer(API_JOBS + '?page=' + page + '&position_keyword=' + findInUrlVar);

    // on press enter in search input
    B8.get('#filterSearchInput').onkeyup = (e) => {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode
            B8.get('#filterSearchButton').click();
        }
    };


    B8.get('#filterSearchButton').addEventListener('click', () => {
        hideJobKeyword();
        const position_keyword = B8.get('#filterSearchInput').value
        document.getElementById('searchedKeyWord').innerHTML = position_keyword;
        var url = API_JOBS + '?page=1&position_keyword=' + position_keyword;
        replaceUrl('position_keyword', position_keyword);
        replaceUrl('page', 1);
        pageRenderer(url, true);
    })




    B8.get('body').onscroll = function () {


        var findInUrlVar = findInUrl('page');
        var page = (findInUrlVar ? findInUrlVar : 1);
        replaceUrl('page', page);


        filterSearchInput = B8.get('#filterSearchInput').value;
        var position = window.pageYOffset
        var bottom = document.body.scrollHeight - window.innerHeight;

        if (position == bottom) {
            var url = 'APIs/API-JOBS.php?' + 'page=' + ++page + '&position_keyword=' + filterSearchInput;
            pageRenderer(url, false, true);
            replaceUrl('page', page)
        }

    };
});