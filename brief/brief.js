const form = document.getElementById("brief-quiz-form");
const steps = Array.from(document.querySelectorAll(".quiz-step"));
const prevBtn = document.getElementById("quiz-prev");
const nextBtn = document.getElementById("quiz-next");
const submitBtn = document.getElementById("quiz-submit");
const progressFill = document.getElementById("quiz-progress-fill");
const stepLabel = document.getElementById("quiz-step-label");
const stepTitle = document.getElementById("quiz-step-title");
const progressTrack = document.querySelector(".quiz-progress-track");
const successBlock = document.getElementById("quiz-success");
const consentInput = document.getElementById("quiz-consent");
const consentError = document.getElementById("quiz-consent-error");
const consentMessage =
  "Чтобы отправить заявку, необходимо согласие на обработку персональных данных.";

let currentStep = 0;
const totalSteps = steps.length;

const getStepTitle = (index) => steps[index]?.dataset.title || "";

const collectFormData = () => {
  const data = new FormData(form);
  return {
    name: data.get("name") || "",
    messenger: data.get("messenger") || "",
    email: data.get("email") || "",
    projectType: data.get("projectType") || "",
    business: data.get("business") || "",
    style: data.getAll("style"),
    features: data.getAll("features"),
    budget: data.get("budget") || "",
    deadline: data.get("deadline") || "",
    comment: data.get("comment") || "",
    createdAt: new Date().toISOString(),
  };
};

const validateCurrentStep = () => {
  const activeStep = steps[currentStep];
  const requiredInputs = Array.from(activeStep.querySelectorAll("[required]"));

  for (const input of requiredInputs) {
    if (input.type === "radio") {
      const groupChecked = activeStep.querySelector(`input[name="${input.name}"]:checked`);
      if (!groupChecked) return false;
      continue;
    }

    if (!input.value.trim()) return false;

    if (input.type === "email" && !input.checkValidity()) return false;
  }

  return true;
};

const clearConsentError = () => {
  if (!consentError || !consentInput) return;
  consentError.hidden = true;
  consentInput.removeAttribute("aria-invalid");
};

const showConsentError = () => {
  if (!consentError || !consentInput) return false;

  consentError.hidden = false;
  consentError.textContent = consentMessage;
  consentInput.setAttribute("aria-invalid", "true");
  consentInput.focus({ preventScroll: false });
  consentInput.scrollIntoView({ behavior: "smooth", block: "center" });
  return false;
};

const updateUI = () => {
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStep);
  });

  const progress = ((currentStep + 1) / totalSteps) * 100;
  progressFill.style.width = `${progress}%`;
  progressTrack?.setAttribute("aria-valuenow", String(currentStep + 1));

  stepLabel.textContent = `Шаг ${currentStep + 1} из ${totalSteps}`;
  stepTitle.textContent = getStepTitle(currentStep);

  prevBtn.disabled = currentStep === 0;
  nextBtn.style.display = currentStep === totalSteps - 1 ? "none" : "inline-flex";
  submitBtn.style.display = currentStep === totalSteps - 1 ? "inline-flex" : "none";
};

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) {
    form.reportValidity();
    return;
  }

  if (currentStep < totalSteps - 1) {
    currentStep += 1;
    updateUI();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep -= 1;
    updateUI();
  }
});

consentInput?.addEventListener("change", () => {
  if (consentInput.checked) clearConsentError();
});

const sendBrief = async (payload) => {
  // TODO: Подключить серверный endpoint, который отправит данные в Telegram/email/Google Sheets.
  // Пример: return fetch("/api/brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

  // Заглушка для демо без интеграции.
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { ok: true };
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) {
    form.reportValidity();
    return;
  }

  if (!consentInput?.checked) {
    showConsentError();
    return;
  }

  clearConsentError();

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправка...";

  try {
    const payload = collectFormData();
    const response = await sendBrief(payload);

    if (!response.ok) throw new Error("Request failed");

    form.hidden = true;
    successBlock.hidden = false;
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
    alert("Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram/email.");
  }
});

updateUI();
