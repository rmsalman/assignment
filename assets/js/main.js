
// variables start
var API_JOBS = "APIs/API-JOBS.php"
var API_CV = "APIs/API-CV.php"
// variables end

// helpers start

function toggler(thisId) {
    thisId = $('#' + thisId);
    thisId.next().removeClass('u-none');
    thisId.hide();
    console.log(thisId);
}

function hideCv() {
    $('#jsMiniJobView').addClass('u-none');
    $('#jsMainListingContainer').removeClass('is-half');
}

const makeRequest = async (method, url, done) => {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(null, xhr.response);
    };
    xhr.onerror = function () {
        done(xhr.response);
    };
    xhr.send();
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
const sidebarRenderer = (Sidefor, arr) => {
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
            <span id="extra_${i}" onclick="toggler('extra_${i}')" ><a href="javascript:;" class="is-gray t-xsmall p0">
                <span>Show More</span>
           </a></span><ul class="list is-basic is-spaced is-compact t-small m0 u-none">`);
        }

        li += (`<li data-i='${i}' class="t-small">
                     <a
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
                        <img src="assets/images/1x1.png"  data-echo="${photo_url}"  class="img-70 u-right m10l" alt="${first_name + ' ' + last_name}" title="${first_name + ' ' + last_name}">
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
            content += '<dd>' + k[find] + '</dd>'
        }
    })

    if (content == '' || typeof content == 'undefined') {
        return '';
    }

    return `<h2 class="h6 p10t">${heading}</h2>
    <dl class="dlist is-spaced is-fitted t-small m0">
        <div>
        ${content}
        </div>
    </dl>
    `;
}

function cvHeader(obj) {
    let { photo_info, first_names, date_modified } = obj
    return `<img src="assets/images/1x1.png" data-echo="${photo_info}" alt="Bank of Jordan logo" title="Bank of Jordan logo" class="img-70 u-left-m">
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

    $('.progresor-container').addClass('progresor-progress');

    makeRequest('GET', API_CV + '/?cv_id=' + cv_id + '&icode=' + icode, function async(err, data) {
        if (err) { throw err; }

        data = JSON.parse(data);
        console.log('CV:', data);
        window.cvz = data;
        $('.progresor-container').addClass('progresor-progress-done');

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

        $('#cvContent').html(cv_training_type + cv_training_institute + cv_education_institution + cv_education_degree + cv_education_major + cv_hobbies_hobby + cv_hobbies_accomplishments + cv_membership_organization + cv_membership_role);
        $('#cv').html(cvHeader(data));
        $('#jsMiniJobView').removeClass('u-none');
        $('#jsMainListingContainer').addClass('is-half');
        $('.progresor-container').removeClass('progresor-progress');
        $('.progresor-container').removeClass('progresor-progress-done');
        echo.init();
    })
}



makeRequest('GET', API_JOBS, function async(err, data) {
    if (err) { throw err; }

    if (data == '') {
        $('body').html('Sorry Data not found');
        return;
    }

    data = JSON.parse(data).result;
    console.log('Jobs: ', data);
    window.jobs = data;

    let filterAges = mapToProp(data, 'age');
    let filterExp = Object.entries(mapToProp(data, 'experince_title'));
    filterAges = ageCounter(filterAges);

    let sidebar = sidebarRenderer('Age', filterAges) + sidebarRenderer('Experience', filterExp);
    let mainContent = mainContentRenderer(data)
    $('#sideBar').html(sidebar);
    $('#mainContent').html(mainContent);
    $('.loading-backdrop').hide(500);
    echo.init()
});
// Controllers end