const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstBtn");
const nextBtnSec = document.querySelector(".secondBtn");
const nextBtnThird = document.querySelector(".thirdBtn");
const submitBtn = document.querySelector(".submit");
const progressCheck = document.querySelectorAll(".step .check");
const bullet = document.querySelectorAll(".step .bullet");
const progressText = document.querySelectorAll(".step span");
const backArrow = document.querySelector('.back-arrow');
let current = 1;


nextBtnFirst.addEventListener("click", function (event) {
  event.preventDefault();


  const nameInput = document.getElementById('name').value;
  const emailInput = document.getElementById('email').value;
  const mobileInput = document.getElementById('mobile').value;

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const mobileError = document.getElementById('mobileError');

  const namePattern = /^[A-Za-z\s]{2,}$/;   // Name should be at least 2 characters long, and only alphabets and spaces are allowed
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email pattern
  const mobilePattern = /^(\+91[-.\s]?)?[789]\d{9}$/;  // 10 digit mobile number

  nameError.textContent = '';
  emailError.textContent = '';
  mobileError.textContent = '';

  if (!namePattern.test(nameInput)) {
    nameError.textContent = 'Please enter a valid name.';
  }

  if (!emailPattern.test(emailInput)) {
    emailError.textContent = 'Please enter a valid email address.';
  }

  if (!mobilePattern.test(mobileInput)) {
    mobileError.textContent = 'Please enter a valid 10-digit mobile number.';
  }

  if (namePattern.test(nameInput) && emailPattern.test(emailInput) && mobilePattern.test(mobileInput)) {
    slidePage.style.marginLeft = "-33.334%";
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current++;
    submitUserRegistration()

  }

});

nextBtnSec.addEventListener("click", function (event) {
  event.preventDefault();
  slidePage.style.marginLeft = "-66.664%";
  bullet[current - 1].classList.add("active");
  progressCheck[current - 1].classList.add("active");
  progressText[current - 1].classList.add("active");
  current++;
  userSubmitDetails()
});

backArrow.addEventListener('click', function (event) {
  event.preventDefault();
  if (current > 1) {
    current--;
    slidePage.style.marginLeft = `-${(current - 1) * 33.334}%`;
    bullet[current - 1].classList.remove("active");
    progressCheck[current - 1].classList.remove("active");
    progressText[current - 1].classList.remove("active");
  }
})

nextBtnThird.addEventListener("click", function (event) {
  event.preventDefault();
  bullet[current - 1].classList.add("active");
  progressCheck[current - 1].classList.add("active");
  progressText[current - 1].classList.add("active");
  current++;
  sendTeamRequest();
  window.location.href = 'thankyoupage.html'
});


function getCookie(name) {
  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}


function prefillForm() {
  let oauth_user = getCookie("oauth_user");

  if (oauth_user) {
    oauth_user = JSON.parse(oauth_user);

    const emailField = document.getElementById("email");
    const verifiedEmail = document.querySelector(".input-wrap.email .verified");
    const sendOTPBtnEmail = document.querySelector(".input-wrap.email .send-otp");

    if (oauth_user.user_email) {
      emailField.value = oauth_user.user_email;
      verifiedEmail.style.display = "flex";
      sendOTPBtnEmail.style.display = "none";
    } else {
      sendOTPBtnEmail.style.display = "block";
      verifiedEmail.style.display = "none";
    }

    const mobileField = document.getElementById("mobile");
    const verifiedMobile = document.querySelector(".input-wrap.mobile .verified");
    const sendOTPBtnMobile = document.querySelector(".input-wrap.mobile .send-otp");

    if (oauth_user.user_phone) {
      mobileField.value = oauth_user.user_phone;
      verifiedMobile.style.display = "flex";
      sendOTPBtnMobile.style.display = "none";
    } else {
      sendOTPBtnMobile.style.display = "block";
      verifiedMobile.style.display = "none";
    }

    const nameField = document.getElementById("name");
    const firstName = oauth_user.user_first_name || "";
    const lastName = oauth_user.user_last_name || "";

    if (firstName || lastName) {
      nameField.value = `${firstName} ${lastName}`.trim();
    }
  }
}

window.addEventListener('load', function () {
  prefillForm()
})

const otpAPI = 'http://disrupto.indianexpress.com:5000/api/send-otp';

const sendOTPMobileBtn = document.getElementById('send_otp_mobile');
const sendOTPEmailBtn = document.getElementById('send_otp_email');
const verifiedMobile = document.getElementById('verified_mobile');
const verifiedEmail = document.getElementById('verified_email');

verifiedMobile.style.display = 'none';
verifiedEmail.style.display = 'none';

async function sendOTP(type, mobile = '', email = '') {
  try {
    if (type === 'mobile') {
      sendOTPMobileBtn.disabled = true;
    } else {
      sendOTPEmailBtn.disabled = true;
    }

    const payload = {
      type: type === 'mobile' ? '1' : '2',
      mobile: mobile || undefined,
      email: email || undefined,
    };

    const response = await fetch(otpAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    const result = await response.json();
    console.log('OTP Sent Successfully:', result);

    if (type === 'mobile') {
      verifiedMobile.style.display = 'flex';
      sendOTPMobileBtn.style.display = 'none';
    } else {
      verifiedEmail.style.display = 'flex';
      sendOTPEmailBtn.style.display = 'none';
    }

  } catch (error) {
    console.error('Error sending OTP:', error);
    alert('Error sending OTP. Please try again.');
  } finally {
    if (type === 'mobile') {
      sendOTPMobileBtn.disabled = false;
    } else {
      sendOTPEmailBtn.disabled = false;
    }
  }
}

const otpGroup = document.querySelector('.otp-group');

sendOTPMobileBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const mobileNumber = document.getElementById('mobile').value;
  if (mobileNumber) {
    sendOTP('mobile', mobileNumber);
    otpGroup.style.display = 'flex';
  } else {
    alert('Please enter a valid mobile number');
  }
});

sendOTPEmailBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  if (email) {
    sendOTP('email', '', email);
    otpGroup.style.display = 'flex';
  } else {
    alert('Please enter a valid email address');
  }
});

const verifyOTPAPI = 'http://disrupto.indianexpress.com:5000/api/verify-otp';

const otpInputs = document.querySelectorAll('.otp-input');

async function verifyOTP(type, mobile = '', email = '', otp) {
  try {
    const payload = {
      type: type === 'mobile' ? '1' : '2',
      mobile: mobile || undefined,
      email: email || undefined,
      otp: otp,
    };

    const response = await fetch(verifyOTPAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      const result = await response.json();
      if (result.status_code === 200) {
        console.log('OTP Verified Successfully:', result);
        alert('OTP Verified Successfully');
        // Perform further actions like enabling form submission
        nextBtnFirst.classList.remove('disable');
      }
      alert("please check your OTP");
    } else {
      throw new Error('OTP Verification Failed');
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    alert('Error verifying OTP. Please try again.');
  }
}

otpInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    if (isNaN(e.target.value)) {
      e.target.value = '';
      return;
    }

    if (e.target.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }

    let otp = '';
    let allFilled = true;

    otpInputs.forEach(input => {
      if (!input.value) {
        allFilled = false;
      }
      otp += input.value;
    });

    if (allFilled && otp.length === otpInputs.length) {
      const mobileNumber = document.getElementById('mobile').value;
      const email = document.getElementById('email').value;

      if (mobileNumber) {
        verifyOTP('mobile', mobileNumber, '', otp);
      } else if (email) {
        verifyOTP('email', '', email, otp);
      }
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});



$(document).ready(function () {
  $('.slide-form').hide();
  $('.add-member-wrap button').click(function () {
    $(this).prop('disabled', true);
    $(this).css('backgroundColor', '#c3c3c3');
    $('.slide-form').show();
  })
})


const collegeNameAPI = 'http://disrupto.indianexpress.com:5000/api/college';

async function populateColleges(state_id) {
  const selectField = document.getElementById('collegeName');

  try {
    const response = await fetch(collegeNameAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state_id })
    });
    if (!response.ok) {
      throw new Error('Error fetching data from API');
    }

    const data = await response.json();
    const college = data.data;

    selectField.innerHTML = '<option value="">Select an option</option>';

    college.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      selectField.appendChild(option);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

const courseAPI = 'http://disrupto.indianexpress.com:5000/api/course';


async function populateCourses() {
  const courseSelectField = document.getElementById('courseName');

  try {
    const response = await fetch(courseAPI);
    if (!response.ok) {
      throw new Error('Error fetching data from API');
    }

    const data = await response.json();
    const course = data.data;
    courseSelectField.innerHTML = '<option value="">Select an option</option>';

    course.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      courseSelectField.appendChild(option);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

populateCourses();


const stateAPI = 'http://disrupto.indianexpress.com:5000/api/state';
const cityAPI = 'http://disrupto.indianexpress.com:5000/api/city';

async function populateStateDropdown() {
  const stateDropdown = document.getElementById('state');
  stateDropdown.disabled = true;
  stateDropdown.innerHTML = '<option>Loading...</option>';
  try {
    const response = await fetch(stateAPI);
    if (!response.ok) {
      throw new Error('Error fetching states');
    }
    const data = await response.json();
    const states = data.data;
    stateDropdown.innerHTML = '<option value="">Select State</option>';
    states.forEach(state => {
      const option = document.createElement('option');
      option.value = state.id;
      option.textContent = state.name;
      stateDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error:', error);
    stateDropdown.innerHTML = '<option>Error loading states</option>';
  } finally {
    stateDropdown.disabled = false;
  }
}


async function populateCityDropdown(state_id) {
  const cityDropdown = document.getElementById('city');
  cityDropdown.disabled = true;
  cityDropdown.innerHTML = '<option>Loading...</option>'
  try {
    const response = await fetch(cityAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state_id })
    });
    if (!response.ok) {
      throw new Error('Error fetching cities');
    }
    const data = await response.json();
    const cities = data.data;
    cityDropdown.innerHTML = '<option value="">Select City</option>'
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city.id;
      option.textContent = city.name;
      cityDropdown.appendChild(option);
    });
    populateColleges(state_id);
  } catch (error) {
    console.error('Error:', error);
    cityDropdown.innerHTML = '<option>Error loading cities</option>'
  } finally {
    cityDropdown.disabled = false;
  }
}

document.getElementById('state').addEventListener('change', function () {
  const stateId = this.value;
  if (stateId) {
    populateCityDropdown(stateId);
  } else {
    document.getElementById('city').innerHTML = '<option value="">Select City</option>';
  }
});
populateStateDropdown();


const invitationsList = document.querySelector('.inviteList');
const seeMoreButton = document.querySelector('.seeMoreBtn');
const itemsPerLoad = 4;
const acceptRejectAPI = 'http://disrupto.indianexpress.com:5000/api/user/accept-request';

let visibleItems = 0;
let allInvitations = [];

async function fetchInvitations() {
  const access_token = getCookie('access_token');
  try {
    const response = await fetch('http://disrupto.indianexpress.com:5000/api/user/view-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invitations');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }
}

function createInvitation(invitation, index) {
  console.log(invitation);
  const { User } = invitation;
  const inviteElement = document.createElement('div');
  inviteElement.className = 'invite';
  inviteElement.innerHTML = `
    <div class="info">
      <div class="name">${User.name} invited you.</div>
      <div class="role">${User.email}</div>
    </div>
    <div class="action">
      <button class="actionButton accept" data-index="${index}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#4CAF50" stroke-width="2"/>
          <path d="M8 12L11 15L16 9" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>Accept</div>
      </button>
      <button class="actionButton decline" data-index="${index}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#666666" stroke-width="2"/>
          <path d="M8 8L16 16M8 16L16 8" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>Decline</div>
      </button>
    </div>
  `;
  return inviteElement;
}

async function sendAcceptRejectRequest(user_id, type, user_request_id) {
  const access_token = getCookie('access_token');
  try {
    const payload = {
      user_id,
      type,
      user_request_id,
      access_token,
    };

    const response = await fetch(acceptRejectAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to accept/reject request');
    }

    const result = await response.json();
    console.log('Action Success:', result);
    return true;
  } catch (error) {
    console.error('Error in Accept/Reject API call:', error);
    alert('Failed to perform the action. Please try again.');
    return false;
  }
}

async function loadMoreInvitations() {
  if (allInvitations.length === 0) {
    allInvitations = await fetchInvitations();
  }

  console.log(allInvitations);
  const endIndex = Math.min(visibleItems + itemsPerLoad, allInvitations.length);
  for (let i = visibleItems; i < endIndex; i++) {
    console.log(allInvitations[i]);
    const invitation = createInvitation(allInvitations[i], i);
    invitationsList.appendChild(invitation);
  }
  visibleItems = endIndex;

  if (visibleItems >= allInvitations.length) {
    seeMoreButton.classList.add('hidden');
  }

  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll('.accept, .decline').forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      const type = e.currentTarget.classList.contains('accept') ? 0 : 1;
      const invitation = allInvitations[index];

      const success = await sendAcceptRejectRequest(invitation.user_id, type, invitation.user_request_id);
      if (success) {
        alert(`Invitation from ${invitation.name} ${type === 0 ? 'accepted' : 'declined'}.`);
        e.currentTarget.closest('.invite').remove();
        allInvitations.splice(index, 1);
      }
    });
  });
}

function initInvitationManager() {
  seeMoreButton.addEventListener('click', loadMoreInvitations);
  loadMoreInvitations();
}

initInvitationManager();





async function submitUserRegistration() {
  const sectionOne = new FormData();
  const name = document.getElementById('name').value
  const mobile = document.getElementById('mobile').value
  const email = document.getElementById('email').value
  const access_token = getCookie('access_token');
  sectionOne.append('name', name);
  sectionOne.append('mobile', mobile);
  sectionOne.append('email', email);
  sectionOne.append('access_token', access_token);
  sectionOne.append('type', 1);


  try {
    const response = await fetch('http://disrupto.indianexpress.com:5000/api/user/submit-detail', {
      method: 'POST',
      body: sectionOne
    })
    if (response.ok) {
      const result = await response.json();
      if(result.status_code === 200){
        console.log('Form One submitted successfully:', result);
      } 
      alert(result.message);
    } else {
      console.error('Error submitting form one:', response.statusText);
    }
  } catch (err) {
    console.log(`Error ${err}`);
  }
}


async function userSubmitDetails() {

  const sectionTwo = new FormData();

  const access_token = getCookie('access_token');
  const state = document.getElementById('state').value;
  const city = document.getElementById('city').value;
  const collegeName = document.getElementById('collegeName').value;
  const courseName = document.getElementById('courseName').value;
  const courseCompletion = document.getElementById('courseCompletion').value;
  const currentYear = document.getElementById('currentyear').value;
  const profileImage = document.getElementById('upload').files[0];

  sectionTwo.append('access_token', access_token);
  sectionTwo.append('state', state);
  sectionTwo.append('city', city);
  sectionTwo.append('college', collegeName);
  sectionTwo.append('course', courseName);
  sectionTwo.append('college_passout_year', courseCompletion);
  sectionTwo.append('current_college_year', currentYear);
  sectionTwo.append('profile_image', profileImage);
  sectionTwo.append('type', 2);

  try {
    const response = await fetch('http://disrupto.indianexpress.com:5000/api/user/submit-detail', {
      method: 'POST',
      body: sectionTwo,
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Form Two submitted successfully:', result);
    } else {
      console.error('Error submitting form:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


async function sendTeamRequest() {
  const sectionThree = new FormData();
  const access_token = getCookie('access_token');

  const user_email = document.getElementById('teamMemberEmail').value
  const user_mobile = document.getElementById('teamMemberMobile').value

  sectionThree.append('user_email', user_email)
  sectionThree.append('user_mobile', user_mobile)
  sectionThree.append('access_token', access_token);


  try {
    const response = await fetch('http://disrupto.indianexpress.com:5000/api/user/send-team-request', {
      method: 'POST',
      body: sectionThree
    })
    if (response.ok) {
      const result = await response.json();
      console.log('Form Three submitted successfully:', result);
    } else {
      console.error('Error submitting form:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}



const checkLayerAPI = 'http://disrupto.indianexpress.com:5000/api/check-registration-status';

async function checkUserLayerStatus() {
  window.addEventListener('load', async function () {
    try {
      const access_token = getCookie('access_token');
      const response = await fetch(checkLayerAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registration status');
      }

      const result = await response.json();

      if (result.data) {
        console.log(result.message);
        if (result.data === 1) {
          showPage(1);
        } else if (result.data === 2) {
          showPage(2);
        } else if (result.data === 3) {
          showPage(3);
        } else {
          console.log('Unknown registration layer status');
        }
      } else {
        console.log('Error:', result.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}

function showPage(pageNumber) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');
  document.querySelector(`.page:nth-child(${pageNumber})`).style.display = 'block';
}

checkUserLayerStatus();


