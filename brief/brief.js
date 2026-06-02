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
const quizCard = document.querySelector(".quiz-card");
const choiceLabels = Array.from(document.querySelectorAll(".quiz-choice"));
const brandFileInput = document.getElementById("quiz-brand-file");
const brandFileName = document.getElementById("quiz-brand-file-name");
const brandFileHint = document.getElementById("quiz-brand-file-hint");
const brandFileReset = document.getElementById("quiz-brand-file-reset");
const customFeatureToggle = document.getElementById("quiz-feature-custom-toggle");
const customFeatureInput = document.getElementById("quiz-feature-custom");
const customFeatureField = document.getElementById("quiz-feature-custom-field");
const customBudgetToggle = document.getElementById("quiz-budget-custom-toggle");
const customBudgetField = document.getElementById("quiz-budget-field");
const customBudgetRange = document.getElementById("quiz-budget-range");
const customBudgetValue = document.getElementById("quiz-budget-value");

const ownerEmail = "nicolaibashkirev@gmail.com";
const consentMessage =
  "Чтобы отправить заявку, необходимо согласие на обработку персональных данных.";
const storageKey = "portfolio-brief-quiz-draft-v1";

let currentStep = 0;
const totalSteps = steps.length;
const defaultBrandFileName = "Можно приложить логотип, бренд-гайд, референс, Word-файл или изображение.";
const defaultBrandFileHint = "Файл добавится к заявке. Если обновить страницу, его нужно будет выбрать заново.";

const getStepTitle = (index) => steps[index]?.dataset.title || "";

const formatBudgetValue = (value) => {
  const amount = Math.max(0, Math.min(500000, Number(value) || 0));
  const formatted = new Intl.NumberFormat("ru-RU").format(amount);
  return amount >= 500000 ? `${formatted} ₽+` : `${formatted} ₽`;
};

const getCustomBudgetAmount = () => {
  const rawValue = customBudgetRange?.value || "0";
  return Math.max(0, Math.min(500000, Number(rawValue) || 0));
};

const collectFormData = () => {
  const data = new FormData(form);
  const features = data.getAll("features").filter((value) => value !== "__custom__");
  const featureCustom = customFeatureToggle?.checked ? String(customFeatureInput?.value || "").trim() : "";
  const budgetValue = data.get("budget") || "";
  const budget =
    budgetValue === "__custom__" ? `Свой бюджет: ${formatBudgetValue(getCustomBudgetAmount())}` : budgetValue;

  return {
    name: data.get("name") || "",
    messenger: data.get("messenger") || "",
    email: data.get("email") || "",
    projectType: data.get("projectType") || "",
    business: data.get("business") || "",
    brandFileName: brandFileInput?.files?.[0]?.name || "",
    style: data.getAll("style"),
    features,
    featureCustom,
    customFeatureEnabled: Boolean(customFeatureToggle?.checked),
    budget,
    budgetCustom: budgetValue === "__custom__" ? String(getCustomBudgetAmount()) : "",
    customBudgetEnabled: budgetValue === "__custom__",
    deadline: data.get("deadline") || "",
    comment: data.get("comment") || "",
    consent: Boolean(data.get("consent")),
    currentStep,
    createdAt: new Date().toISOString(),
  };
};

const saveDraft = () => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(collectFormData()));
  } catch (error) {
    // ignore storage failures
  }
};

const restoreDraft = () => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;

    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== "object") return;

    Object.entries(draft).forEach(([key, value]) => {
      if (key === "style" || key === "features") {
        if (!Array.isArray(value)) return;
        value.forEach((item) => {
          const input = form.querySelector(`input[name="${key}"][value="${item}"]`);
          if (input) input.checked = true;
        });
        return;
      }

      if (key === "customFeatureEnabled") {
        if (customFeatureToggle) customFeatureToggle.checked = Boolean(value);
        return;
      }

      if (key === "customBudgetEnabled") {
        if (customBudgetToggle) customBudgetToggle.checked = Boolean(value);
        return;
      }

      if (key === "brandFileName") {
        syncBrandFileMeta({ draftFileName: typeof value === "string" ? value : "" });
        return;
      }

      if (key === "budgetCustom") {
        syncCustomBudgetValue(value);
        return;
      }

      if (key === "consent") {
        if (consentInput) consentInput.checked = Boolean(value);
        return;
      }

      if (key === "currentStep") {
        if (Number.isInteger(value)) {
          currentStep = Math.min(Math.max(value, 0), totalSteps - 1);
        }
        return;
      }

      const field = form.elements.namedItem(key);
      if (!field) return;

      if (field instanceof RadioNodeList) {
        const input = form.querySelector(`input[name="${key}"][value="${value}"]`);
        if (input) input.checked = true;
        return;
      }

      if ("value" in field && typeof value === "string") {
        field.value = value;
      }
    });
  } catch (error) {
    // ignore malformed drafts
  }
};

const clearDraft = () => {
  try {
    window.localStorage.removeItem(storageKey);
  } catch (error) {
    // ignore storage failures
  }
};

const updateChoiceStates = () => {
  choiceLabels.forEach((label) => {
    const input = label.querySelector("input");
    label.classList.toggle("is-selected", Boolean(input?.checked));
  });
};

const syncBrandFileMeta = ({ draftFileName = "" } = {}) => {
  if (!brandFileName || !brandFileHint || !brandFileReset) return;

  const selectedFile = brandFileInput?.files?.[0];

  if (selectedFile) {
    brandFileName.textContent = `Выбран файл: ${selectedFile.name}`;
    brandFileHint.textContent = "Файл будет отправлен вместе с заявкой.";
    brandFileReset.hidden = false;
    return;
  }

  if (draftFileName) {
    brandFileName.textContent = `Ранее был выбран файл: ${draftFileName}`;
    brandFileHint.textContent = "После обновления страницы вложение нужно выбрать заново.";
    brandFileReset.hidden = true;
    return;
  }

  brandFileName.textContent = defaultBrandFileName;
  brandFileHint.textContent = defaultBrandFileHint;
  brandFileReset.hidden = true;
};

const syncCustomFeatureField = ({ shouldFocus = false } = {}) => {
  if (!customFeatureField || !customFeatureInput) return;

  const isEnabled = Boolean(customFeatureToggle?.checked);
  customFeatureField.classList.toggle("is-visible", isEnabled);
  customFeatureInput.disabled = !isEnabled;

  if (isEnabled && shouldFocus) {
    window.requestAnimationFrame(() => {
      customFeatureInput.focus({ preventScroll: true });
    });
  }
};

const syncCustomBudgetValue = (value) => {
  if (!customBudgetRange || !customBudgetValue) return;

  const amount = Math.max(0, Math.min(500000, Number(value) || 0));
  customBudgetRange.value = String(amount);
  customBudgetValue.textContent = formatBudgetValue(amount);
};

const syncCustomBudgetField = ({ shouldFocus = false } = {}) => {
  if (!customBudgetField || !customBudgetRange) return;

  const isEnabled = Boolean(customBudgetToggle?.checked);
  customBudgetField.classList.toggle("is-visible", isEnabled);
  customBudgetRange.disabled = !isEnabled;
  syncCustomBudgetValue(getCustomBudgetAmount());

  if (isEnabled && shouldFocus) {
    window.requestAnimationFrame(() => {
      customBudgetRange.focus({ preventScroll: true });
    });
  }
};

const getFocusableInput = (step) =>
  step.querySelector(
    'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
  );

const validateCurrentStep = () => {
  const activeStep = steps[currentStep];
  const requiredInputs = Array.from(activeStep.querySelectorAll("[required]"));

  for (const input of requiredInputs) {
    if (input.type === "radio") {
      const groupChecked = activeStep.querySelector(`input[name="${input.name}"]:checked`);
      if (!groupChecked) return false;
      continue;
    }

    if (!String(input.value || "").trim()) return false;

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

const syncButtonState = () => {
  const isLastStep = currentStep === totalSteps - 1;
  const isCurrentStepValid = validateCurrentStep();

  prevBtn.disabled = currentStep === 0;
  nextBtn.disabled = !isCurrentStepValid;
  nextBtn.style.display = isLastStep ? "none" : "inline-flex";

  submitBtn.disabled = !isLastStep || !isCurrentStepValid || !Boolean(consentInput?.checked);
  submitBtn.style.display = isLastStep ? "inline-flex" : "none";
};

const focusCurrentStep = () => {
  const step = steps[currentStep];
  const field = getFocusableInput(step);
  if (!field) return;

  window.requestAnimationFrame(() => {
    field.focus({ preventScroll: true });
  });
};

const scrollCardIntoView = () => {
  if (!quizCard) return;
  quizCard.scrollIntoView({ behavior: "smooth", block: "start" });
};

const updateUI = ({ shouldFocus = false, shouldScroll = false } = {}) => {
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStep);
  });

  const progress = ((currentStep + 1) / totalSteps) * 100;
  progressFill.style.width = `${progress}%`;
  progressTrack?.setAttribute("aria-valuenow", String(currentStep + 1));

  stepLabel.textContent = `Шаг ${currentStep + 1} из ${totalSteps}`;
  stepTitle.textContent = getStepTitle(currentStep);

  syncCustomFeatureField();
  syncCustomBudgetField();
  updateChoiceStates();
  syncButtonState();
  saveDraft();

  if (shouldScroll) scrollCardIntoView();
  if (shouldFocus) focusCurrentStep();
};

const resetQuizState = () => {
  form.hidden = false;
  successBlock.hidden = true;
  submitBtn.disabled = false;
  submitBtn.textContent = "Отправить заявку";
};

const goToStep = (nextStep) => {
  currentStep = Math.min(Math.max(nextStep, 0), totalSteps - 1);
  updateUI({ shouldFocus: true, shouldScroll: true });
};

const sendBrief = async (payload) => {
  const requestBody = new FormData();
  const submittedAt = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Novosibirsk",
  }).format(new Date());

  requestBody.append("_subject", "Новая заявка с квиза portfolio");
  requestBody.append("_template", "table");
  requestBody.append("_captcha", "false");
  requestBody.append("_replyto", payload.email);

  requestBody.append("Имя", payload.name);
  requestBody.append("Telegram / WhatsApp", payload.messenger);
  requestBody.append("Email", payload.email);
  requestBody.append("Тип проекта", payload.projectType);
  requestBody.append("Описание бизнеса", payload.business);
  if (payload.brandFileName) {
    requestBody.append("Файл", payload.brandFileName);
  }
  requestBody.append("Стиль сайта", payload.style.length ? payload.style.join(", ") : "Не указано");
  const featuresSummary = [...payload.features];
  if (payload.featureCustom) {
    featuresSummary.push(`Своё: ${payload.featureCustom}`);
  }
  requestBody.append("Нужные функции", featuresSummary.length ? featuresSummary.join(", ") : "Не указано");
  requestBody.append("Бюджет", payload.budget);
  requestBody.append("Сроки", payload.deadline);
  requestBody.append("Комментарий", payload.comment || "Не указано");
  requestBody.append("Согласие", payload.consent ? "Да" : "Нет");
  requestBody.append("Дата отправки", submittedAt);
  if (brandFileInput?.files?.[0]) {
    requestBody.append("attachment", brandFileInput.files[0]);
  }

  const response = await fetch(`https://formsubmit.co/ajax/${ownerEmail}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: requestBody,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Request failed");
  }

  return { ok: true, result };
};

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) {
    form.reportValidity();
    return;
  }

  if (currentStep < totalSteps - 1) {
    goToStep(currentStep + 1);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    goToStep(currentStep - 1);
  }
});

form.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

  if (target === consentInput && target.checked) clearConsentError();

  if (target === brandFileInput) {
    syncBrandFileMeta();
  }

  if (target === customFeatureToggle) {
    syncCustomFeatureField({ shouldFocus: target.checked });
  }

  if (target === customFeatureInput && customFeatureToggle && target.value.trim()) {
    customFeatureToggle.checked = true;
    syncCustomFeatureField();
  }

  if (target.name === "budget") {
    syncCustomBudgetField({ shouldFocus: target === customBudgetToggle && target.checked });
  }

  if (target === customBudgetRange) {
    if (customBudgetToggle) customBudgetToggle.checked = true;
    syncCustomBudgetValue(target.value);
    syncCustomBudgetField();
  }

  updateChoiceStates();
  syncButtonState();
  saveDraft();
});

brandFileReset?.addEventListener("click", () => {
  if (!brandFileInput) return;
  brandFileInput.value = "";
  syncBrandFileMeta();
  saveDraft();
});

form.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target === brandFileInput) {
    syncBrandFileMeta();
  }

  if (target === customFeatureToggle) {
    syncCustomFeatureField({ shouldFocus: target.checked });
  }

  if (target === customBudgetToggle) {
    syncCustomBudgetField({ shouldFocus: target.checked });
  }

  updateChoiceStates();
  syncButtonState();
  saveDraft();

  const activeStep = steps[currentStep];
  const radioInputs = activeStep.querySelectorAll('input[type="radio"]');
  const hasOnlyRadioChoices =
    radioInputs.length > 0 &&
    activeStep.querySelectorAll("textarea, input[type='text'], input[type='email'], input[type='number'], input[type='range']").length === 0;

  if (target.type === "radio" && hasOnlyRadioChoices && validateCurrentStep() && currentStep < totalSteps - 1) {
    window.setTimeout(() => {
      if (target.checked && currentStep < totalSteps - 1) {
        goToStep(currentStep + 1);
      }
    }, 140);
  }
});

form.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key !== "Enter") return;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.type === "radio" || target.type === "checkbox") return;

  event.preventDefault();

  if (currentStep < totalSteps - 1) {
    if (validateCurrentStep()) {
      goToStep(currentStep + 1);
    } else {
      form.reportValidity();
    }
    return;
  }

  if (!submitBtn.disabled) {
    form.requestSubmit();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) {
    form.reportValidity();
    return;
  }

  if (!consentInput?.checked) {
    showConsentError();
    syncButtonState();
    return;
  }

  clearConsentError();

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправка...";

  try {
    const payload = collectFormData();
    const response = await sendBrief(payload);

    if (!response.ok) throw new Error("Request failed");

    clearDraft();
    form.hidden = true;
    successBlock.hidden = false;
    successBlock.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
    syncButtonState();
    alert("Не удалось отправить заявку. Попробуйте ещё раз или напишите на email.");
  }
});

restoreDraft();
syncBrandFileMeta();
resetQuizState();
updateUI();
