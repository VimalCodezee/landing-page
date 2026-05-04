document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("plans-container");
  const slider = document.getElementById("emp-slider");
  const countEl = document.getElementById("emp-count");

  let employeeCount = 34;

  const res = await fetch("data/plans.json");
  const plans = await res.json();

  function formatINR(num) {
    return new Intl.NumberFormat("en-IN").format(num);
  }

  function renderPlans() {
    container.innerHTML = plans
      .map((plan) => {
        const isPopular = plan.popular;

        let priceHtml = "";

        if (plan.type === "monthly") {
          priceHtml = `
            <div class="flex items-end gap-[4px] mb-[8px]">
              <span class="text-[25px] lg:text-[36px] font-[600] leading-[32px] lg:leading-[44px] text-[#191C1E]">
                ₹${plan.price}
              </span>
              <span class="text-[14px] lg:text-[16px] font-[500] leading-[17px] lg:leading-[19px] text-[#45464D] mb-[4px] lg:mb-[5px]">
                / employee / month
              </span>
            </div>

            <p id="price-${
              plan.id
            }" class="text-[12px] leading-[16px] text-[#45464D] font-[400] mb-[20px] lg:mb-[40px] font-inter">
              Min. ₹${formatINR(employeeCount * plan.price)} / month commitment
            </p>
          `;
        } else {
          priceHtml = `
            <div>
              <span class="text-[25px] lg:text-[36px] font-[600] leading-[32px] lg:leading-[44px] text-[#191C1E] mb-[4px] lg:mb-[8px]">Custom</span>
            </div>
            <p class="text-[12px] lg:text-[14px] font-[400] leading-[16px] lg:leading-[17px] text-[#45464D] mb-[12px] lg:mb-[40px]">
              Tailored pricing for your scale
            </p>
          `;
        }

        return `
        <div>
        ${
          isPopular
            ? `
          <div class="p-[1px] pb-[2px] rounded-[24px] bg-[linear-gradient(180deg,#E8F2FE_0%,#141A2A_100%)]  lg:bg-[linear-gradient(180deg,#243F89_0%,#141A2A_100%)] relative">
            <div class="rounded-[24px] bg-[linear-gradient(138.31deg,#EEF9FF_0%,#FFFFFF_100%)] py-[16px] lg:py-[28px] lg:px-[30px] px-[15px] h-full flex flex-col justify-between">
              <div class="absolute w-[110px] lg:w-[145px] h-[24px] lg:h-[33px] -top-3 left-[70%] -translate-x-1/2 bg-white text-[#1e3a8a] border border-[#1e3a8a] font-bold text-[10px] lg:text-[11px] uppercase items-center flex justify-center rounded-full shadow-sm z-20">
                MOST POPULAR
              </div>  
<div>

          <h2 class="text-[18px] lg:text-[24px] font-[600] leading-[22px] lg:leading-[29px] text-[#191C1E] mb-[4px] lg:mb-[8px]">${
            plan.name
          }</h2>
          <p class="text-[12px] lg:text-[14px] font-[400] leading-[16px] lg:leading-[20px] text-[#45464D] mb-[12px] lg:mb-[32px]">${
            plan.tagline
          }</p>

          ${priceHtml}

          <ul class="grid gap-[12px] lg:gap-[16px] mb-[20px] lg:mb-[48px]">
            ${plan.features
              .map(
                (feature) => `
              <li class="flex items-center gap-[12px]">
                <div class="flex-shrink-0 w-[15px] h-[15px] lg:w-[24px] lg:h-[24px] border border-[#B3E8C2] rounded-full bg-green-100/80 flex items-center justify-center mt-0 lg:mt-0.5">
                  <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span class="text-[14px] font-[400] text-[#45464D] leading-[17px]"> ${feature}</span>
              </li>
            `
              )
              .join("")}
          </ul></div>

          <button
            data-plan="${plan.id}"
            class=" !font-inter !text-[12px] !lg:text-[16px] !px-[12px] !py-[10px] !leading-normal !rounded-[12px] !font-[500] lg:!font-semibold  transition-all bg-[linear-gradient(180deg,#243F89_0%,#141A2A_100%)] text-white"
          >
            ${plan.buttonText}
          </button>

         
        </div>
          </div>`
            : `
           <div class="bg-[#ffffff] relative rounded-[24px] py-[16px] lg:py-[28px] lg:px-[30px] px-[15px] h-full flex flex-col justify-between lg:border-none border-b-[2px] border-[#C6C6CD]">
<div>

          <h2 class="text-[18px] lg:text-[24px] font-[600] leading-[22px] lg:leading-[29px] text-[#191C1E] mb-[4px] lg:mb-[8px]">${
            plan.name
          }</h2>
          <p class="text-[12px] lg:text-[14px] font-[400] leading-[16px] lg:leading-[20px] text-[#45464D] mb-[12px] lg:mb-[32px]">${
            plan.tagline
          }</p>

          ${priceHtml}

          <ul class="grid gap-[12px] lg:gap-[16px] mb-[20px] lg:mb-[48px]">
            ${plan.features
              .map(
                (feature) => `
              <li class="flex items-center gap-[12px]">
                <div class="flex-shrink-0 w-[15px] h-[15px] lg:w-[24px] lg:h-[24px] border border-[#B3E8C2] rounded-full bg-green-100/80 flex items-center justify-center mt-0 lg:mt-0.5">
                  <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span class="text-[14px] font-[400] text-[#45464D] leading-[17px]"> ${feature}</span>
              </li>
            `
              )
              .join("")}
          </ul></div>

          <button
            data-plan="${plan.id}"
            class="!w-full !font-inter !text-[12px] !lg:text-[16px] !px-[12px] !py-[8px] !leading-normal !rounded-[12px] !font-[500] !lg:font-semibold transition-all !bg-transparent !text-gray-900 !border-[2px] !border-[#C6C6CD]"
          >
            ${plan.buttonText}
          </button>
        </div>`
        }
        </div>
       
      `;
      })
      .join("");

    bindButtons();
  }

  function updatePricesOnly() {
    plans.forEach((plan) => {
      if (plan.type === "monthly") {
        const el = document.getElementById(`price-${plan.id}`);
        if (el) {
          el.textContent = `Min. ₹${formatINR(
            employeeCount * plan.price
          )} / month commitment`;
        }
      }
    });
  }

  function bindButtons() {
    document.querySelectorAll("[data-plan]").forEach((btn) => {
      btn.addEventListener("click", function () {
        localStorage.setItem("selectedPlan", this.dataset.plan);
        localStorage.setItem("employeeCount", employeeCount.toString());
        window.location.href = "addons.html";
      });
    });
  }

  if (slider) {
    slider.addEventListener("input", function () {
      employeeCount = parseInt(this.value);
      countEl.textContent = employeeCount;

      const pct =
        ((employeeCount - parseInt(slider.min)) /
          (parseInt(slider.max) - parseInt(slider.min))) *
        100;
      slider.style.background = `linear-gradient(to right, #1e3a6e 0%, #1e3a6e ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;

      updatePricesOnly();
    });

    // Initialize slider background
    const initialPct =
      ((employeeCount - parseInt(slider.min)) /
        (parseInt(slider.max) - parseInt(slider.min))) *
      100;
    slider.style.background = `linear-gradient(to right, #1e3a6e 0%, #1e3a6e ${initialPct}%, #e2e8f0 ${initialPct}%, #e2e8f0 100%)`;
  }

  renderPlans();

  // ─── Demo Modal Logic ───
  const modal = document.getElementById("demoModal");
  const closeBtn = document.getElementById("closeDemoModal");

  function openModal() {
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(".free-demo-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    })
  );

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
});
