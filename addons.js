(function () {
  "use strict";

  let PLAN_MONTHLY = 0;
  let PLAN_TYPE = "monthly";
  const state = {};

  const icons = {
    biometric: `<svg class="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-gray-700" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>`,
    migration: `<svg class="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-gray-700"fill="none"stroke="currentColor"stroke-width="1.8"viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.66 3.134 3 7 3s7-1.34 7-3V5" /><path d="M5 11v6c0 1.66 3.134 3 7 3s7-1.34 7-3v-6" /></svg>`,
    priority: `<svg class="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-gray-700" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0116 0" /><rect x="3" y="11" width="4" height="7" rx="2" /><rect x="17" y="11" width="4" height="7" rx="2" /><path d="M21 18v1a2 2 0 01-2 2h-3" /></svg>`,
    reports: `<img src="./assets/images/Growth.png"class="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-gray-700"alt="growth graph"/>`,
  };

  function formatINR(n) {
    return "₹" + new Intl.NumberFormat("en-IN").format(n);
  }

  async function loadData() {
    try {
      const [addonsRes, plansRes] = await Promise.all([
        fetch("data/addons.json"),
        fetch("data/plans.json"),
      ]);
      const data = await addonsRes.json();
      const plans = await plansRes.json();

      const selectedPlanId =
        localStorage.getItem("selectedPlan") || "professional";
      const empCount = parseInt(
        localStorage.getItem("employeeCount") || "46",
        10
      );

      const plan = plans.find((p) => p.id === selectedPlanId) || plans[1];
      PLAN_TYPE = plan.type;

      if (plan.type === "monthly") {
        PLAN_MONTHLY = plan.price * empCount;
      } else {
        PLAN_MONTHLY = 0; // Custom pricing
      }

      document.getElementById("plan-name").textContent = plan.name + " Plan";
      document.getElementById("plan-price").textContent =
        plan.type === "monthly" ? formatINR(PLAN_MONTHLY) : "Custom";
      document.getElementById(
        "plan-employees"
      ).textContent = `Up to ${empCount} employees`;

      renderCards(data.addons);
      renderSummary();
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  function renderCards(addons) {
    const grid = document.getElementById("addon-grid");
    grid.innerHTML = "";

    addons.forEach((item) => {
      // Preserve state if it already exists, otherwise init
      if (!state[item.id]) {
        state[item.id] = { ...item };
      }
      const currentItem = state[item.id];

      const card = document.createElement("div");
      card.className = `addon-card ${currentItem.selected ? "selected" : ""}`;
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="flex items-start justify-between mb-[12px] xl:mb-[24px]">
            ${icons[item.id] || "📦"}

          ${
            item.showCheckbox === false
              ? ""
              : `
          <div class="card-checkbox">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          `
          }
        </div>

        <h3 class=" text-[14px] xl:text-[18px] font-[500] text-[#191C1E] mb-[8px]" style="line-height:normal;">
          ${item.label} 
        </h3>

        <p class="text-[12px] xl:text-[14px] text-[#7C7C7C] mb-[12px] lg:mb-[23px]" style=" line-height:normal;">
          ${item.description}
        </p>

        <div class="flex items-center justify-between">
          <div>
            <span class="text-[20px] font-bold text-gray-900" style=" line-height:normal;">
              ${formatINR(item.rate)}${item.contact ? "+ " : ""}
            </span>
            ${
              item.contact
                ? ""
                : `<span class="text-xs text-gray-400 ml-1">/ ${item.unit}</span>`
            }
          </div>
          ${
            item.contact
              ? `<a href="" class="text-[14px] font-[400] text-[#3BA4E8] underline underline-offset-[3px] hover:text-blue-500 transition-colors whitespace-nowrap">Contact Support</a>`
              : ""
          }
        </div>
      `;

      grid.appendChild(card);
    });

    initEvents();
  }

  function initEvents() {
    // Rebind left side card events
    document.querySelectorAll(".addon-card").forEach((card) => {
      const id = card.dataset.id;

      card.addEventListener("click", (e) => {
        // Prevent toggling when clicking buttons or links or if card does not show a checkbox
        if (
          state[id].showCheckbox === false ||
          e.target.closest(".qty-stepper") ||
          e.target.closest("a")
        )
          return;

        state[id].selected = !state[id].selected;
        renderCards(Object.values(state));
        renderSummary();
      });

    });
  }

  // Summary logic with event delegation
  const summaryBox = document.getElementById("summary-addons");
  summaryBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".sum-qty-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id || !state[id]) return;

    if (btn.classList.contains("plus")) {
      state[id].qty++;
    } else if (btn.classList.contains("minus")) {
      if (state[id].qty > 1) state[id].qty--;
    }
    renderCards(Object.values(state));
    renderSummary();
  });

  function renderSummary() {
    const no = document.getElementById("no-addons");
    summaryBox.innerHTML = "";

    const selected = Object.values(state).filter(
      (item) => item.selected && !item.contact
    );

    let total = PLAN_MONTHLY;

    if (selected.length === 0) {
      no.classList.remove("hidden");
    } else {
      no.classList.add("hidden");
    }

    selected.forEach((item, index) => {
      // Monthly fees don't scale by qty in summary UI if unit is month, wait actually if it's month unit like priority support it doesn't have qty adjuster.
      const rowTotal = item.unit === "month" ? item.rate : item.qty * item.rate;
      total += rowTotal;
      summaryBox.innerHTML += `
        <div class="flex flex-row items-center justify-between   min-h-[59px] lg:min-h-[38px]  ${
          index + 1 <= selected.length - 1 ? "border-b border-[#e6e6e68f]" : ""
        }  lg:border-none">
          <span class="text-[#45464D] font-[400] text-[14px] leading-[20px]">${
            item.label
          }</span>
          <div class="flex flex-col sm:flex-row items-center  ${
            item.unit !== "month"
              ? "justify-between "
              : "justify-center lg:justify-end h-full"
          } gap-[4px] md:gap-[8px] pb-[5px]">
            ${
              item.unit !== "month"
                ? `<div class="flex items-center gap-1 bg-[#F2F3F4] border border-[#E6E6E6] rounded-[12px] p-[3px]">
              <button class="sum-qty-btn minus" data-id="${item.id}">−</button>
              <span class="px-[7px] sm:px-[14px] text-center text-[12px] sm:text-[16px] font-[600] text-[#000000]">${item.qty}</span>
              <button class="sum-qty-btn plus" data-id="${item.id}">+</button>
             </div>`
                : "<div></div>"
            }
            <div class="flex items-center gap-[4px]">
              <span class="font-[600] sm:leading-[22px] leading-[18px] text-[#191C1E] sm:text-[18px] text-[14px]">${formatINR(
                rowTotal
              )}</span>
              <span class="sm:text-[12px] text-[10px] sm:leading-[16px] leading-[14px] font-[400] text-[#45464D]"> / month</span>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById("total-price").textContent =
      PLAN_TYPE === "monthly" ? formatINR(total) : "Custom";
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData();

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
})();
