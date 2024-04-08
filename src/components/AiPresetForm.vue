<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    label-position="left"
  >
    <el-form-item label="Preset Name" prop="name">
      <el-input v-model="ruleForm.name" autocomplete="off" />
    </el-form-item>
    <el-form-item label="top_p" prop="top_p">
      <el-input v-model="ruleForm.top_p" autocomplete="off" />
    </el-form-item>
    <el-form-item label="temperature" prop="temperature">
      <el-input v-model="ruleForm.temperature" autocomplete="on" />
    </el-form-item>
    <el-form-item label="penalty_score" prop="penalty_score">
      <el-input v-model="ruleForm.penalty_score" />
    </el-form-item>
    <el-form-item label="max_output_tokens" prop="max_output_tokens">
      <el-input v-model="ruleForm.max_output_tokens" />
    </el-form-item>
    <el-form-item label="system" prop="system">
      <el-input v-model="ruleForm.system" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >Submit</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
const props = defineProps({ form: Object });
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(["save"]);
const validateName = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入ai预设名字，不可重复"));
  }
  //将value与先前预设的name就行比较，如果重复则callback报错
  if (value === "test") {
    return callback(new Error(`名字重复，请勿使用${value}作为预设名字`));
  }
  return callback();
};
const validateEmpty = (rule: any, value: any, callback: any) => {
  if (!value.trim()) {
    return callback(new Error("system不能为空"));
  }
  return callback();
};
const createValidateNumber = (type: any) => {
  let range = {
    isLeftClosed: true,
    isRightClosed: true,
    leftNum: 0,
    rightNum: 0,
  };
  switch (type) {
    case "temperature":
      range.isLeftClosed = false;
      range.leftNum = 0;
      range.rightNum = 1;
      range.isRightClosed = true;
      break;
    case "top_p":
      range.isLeftClosed = true;
      range.leftNum = 0;
      range.rightNum = 1;
      range.isRightClosed = true;
      break;
    case "penalty_score":
      range.isLeftClosed = true;
      range.leftNum = 1;
      range.rightNum = 2;
      range.isRightClosed = true;
      break;
    case "max_output_tokens":
      range.isLeftClosed = true;
      range.leftNum = 2;
      range.rightNum = 2048;
      range.isRightClosed = true;
      break;
  }
  return (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback();
    }
    if (isNaN(parseFloat(value)) || !isFinite(value)) {
      return callback(new Error("请输入数值"));
    }
    const valid = range.isLeftClosed
      ? range.isRightClosed
        ? value >= range.leftNum && value <= range.rightNum
        : value >= range.leftNum && value < range.rightNum
      : range.isRightClosed
      ? value > range.leftNum && value <= range.rightNum
      : value > range.leftNum && value < range.rightNum;
    if (!valid) {
      return callback(
        new Error(
          `请输入${range.isLeftClosed ? "[" : "("}${range.leftNum},${
            range.rightNum
          }${range.isRightClosed ? "]" : ")"}之间的数值`
        )
      );
    }
    return callback();
  };
};
const ruleForm = reactive({
  name: props.form?.name || "",
  temperature: props.form?.temperature || "",
  top_p: props.form?.top_p || "",
  penalty_score: props.form?.penalty_score || "",
  system: props.form?.system || "",
  max_output_tokens: props.form?.max_output_tokens || "",
});

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [{ validator: validateName, required: true, trigger: "blur" }],
  temperature: [
    { validator: createValidateNumber("temperature"), trigger: "blur" },
  ],
  top_p: [{ validator: createValidateNumber("top_p"), trigger: "blur" }],
  penalty_score: [
    { validator: createValidateNumber("penalty_score"), trigger: "blur" },
  ],
  system: [{ validator: validateEmpty, trigger: "blur", required: true }],
  max_output_tokens: [
    { validator: createValidateNumber("max_output_tokens"), trigger: "blur" },
  ],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      //判断ruleForm和props.form的相同属性是否一致，以判断是否修改过
      const isSame = Object.keys(ruleForm).every((key) => {
        return ruleForm[key] === props.form?.[key];
      });
      const data = props.form ? Object.assign(props.form, ruleForm) : ruleForm;
      emit("save", data, props.form,isSame);
      formEl.resetFields();
    } else {
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style>
.el-form-item__content {
  justify-content: flex-end;
}
</style>
