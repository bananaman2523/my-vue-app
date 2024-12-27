<template>
  <div class="container">
    <h2>เอกสารคำร้องขอเบิกสินค้า</h2>
    <form @submit.prevent="submitForm" class="form-container">
      
      <div class="form-group">
        <label for="documentNumber">เลขที่เอกสาร</label>
        <input
          type="text"
          id="documentNumber"
          v-model="form.documentNumber"
          placeholder="S + เลขสี่ตัวท้าย"
          required
        />
      </div>

      <div class="form-group">
        <label for="quotationNumber">เลขที่ใบเสนอราคา/ใบวางบิล</label>
        <input
          type="text"
          id="quotationNumber"
          v-model="form.quotationNumber"
          placeholder="สามารถอัปเดตได้ในภายหลัง"
        />
      </div>

      <div class="form-group">
        <label for="companyName">ชื่อบริษัท</label>
        <input
          type="text"
          id="companyName"
          v-model="form.companyName"
          required
        />
      </div>

      <div class="form-group">
        <label for="branchName">ชื่อสาขา</label>
        <input
          type="text"
          id="branchName"
          v-model="form.branchName"
          required
        />
      </div>

      <div class="form-group">
        <label for="startDate">วันที่เริ่มต้น</label>
        <input
          type="date"
          id="startDate"
          v-model="form.startDate"
          required
        />
      </div>

      <div class="form-group">
        <label for="endDate">วันที่สิ้นสุด</label>
        <input
          type="date"
          id="endDate"
          v-model="form.endDate"
          required
        />
      </div>

      <div class="form-group">
        <label for="equipment">อุปกรณ์</label>
        <input
          type="text"
          id="equipment"
          v-model="form.equipment"
          required
        />
      </div>

      <div class="form-group">
        <label for="quantity">จำนวน</label>
        <input
          type="number"
          id="quantity"
          v-model="form.quantity"
          required
        />
      </div>

      <div class="form-group">
        <label for="modelBrand">รุ่น/แบรนด์</label>
        <input
          type="text"
          id="modelBrand"
          v-model="form.modelBrand"
          required
        />
      </div>

      <div class="form-group">
        <label for="serialNumber">Serial number</label>
        <input
          type="text"
          id="serialNumber"
          v-model="form.serialNumber"
          required
        />
      </div>

      <div class="form-group">
        <label for="posTerminal">POS Terminal</label>
        <input
          type="text"
          id="posTerminal"
          v-model="form.posTerminal"
        />
      </div>

      <div class="form-group">
        <label for="withdrawalDetails">รายละเอียดของการเบิก</label>
        <textarea
          id="withdrawalDetails"
          v-model="form.withdrawalDetails"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="withdrawFrom">เบิกจากไหน</label>
        <input
          type="text"
          id="withdrawFrom"
          v-model="form.withdrawFrom"
          required
        />
      </div>

      <div class="form-group">
        <label for="purpose">เบิกเพื่ออะไร</label>
        <input
          type="text"
          id="purpose"
          v-model="form.purpose"
          required
        />
      </div>

      <div class="form-group">
        <label for="additionalNotes">รายละเอียดเพิ่มเติม / หมายเหตุ</label>
        <textarea
          id="additionalNotes"
          v-model="form.additionalNotes"
        ></textarea>
      </div>

      <h3>e-signature</h3>
      <div class="form-group">
        <label for="requester">ผู้ขอเบิก</label>
        <input
          type="text"
          id="requester"
          v-model="form.requester"
          required
        />
      </div>

      <div class="form-group">
        <label for="approver">ผู้อนุมัติ</label>
        <input
          type="text"
          id="approver"
          v-model="form.approver"
          required
        />
      </div>

      <div class="form-group">
        <label for="returner">ผู้คืน</label>
        <input
          type="text"
          id="returner"
          v-model="form.returner"
          required
        />
      </div>

      <div class="form-group">
        <label for="receiver">ผู้ตรวจรับ</label>
        <input
          type="text"
          id="receiver"
          v-model="form.receiver"
          required
        />
      </div>

      <div class="form-group">
        <label for="timestamp">Timestamp</label>
        <input
          type="datetime-local"
          id="timestamp"
          v-model="form.timestamp"
          required
        />
      </div>

      <button type="submit" class="submit-btn">Submit</button>
    </form>

    <!-- Pagination Control -->
    <div v-if="showMorePage" class="pagination">
      <button @click="nextPage" class="next-btn">Next Page</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        documentNumber: '',
        quotationNumber: '',
        companyName: '',
        branchName: '',
        startDate: '',
        endDate: '',
        equipment: '',
        quantity: '',
        modelBrand: '',
        serialNumber: '',
        posTerminal: '',
        withdrawalDetails: '',
        withdrawFrom: '',
        purpose: '',
        additionalNotes: '',
        requester: '',
        approver: '',
        returner: '',
        receiver: '',
        timestamp: '',
      },
      showMorePage: false,
    };
  },
  methods: {
    submitForm() {
      // Handle form submission (e.g., send data to backend)
      console.log(this.form);
    },
    nextPage() {
      this.showMorePage = true;
      window.scrollTo(0, document.body.scrollHeight); // Scroll to next page
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h3 {
  margin-top: 30px;
  color: #333;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #555;
}

input,
textarea {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
  background-color: #fff;
}

textarea {
  height: 100px;
  resize: vertical;
}

button.submit-btn {
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.submit-btn:hover {
  background-color: #45a049;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.next-btn {
  padding: 12px 20px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.next-btn:hover {
  background-color: #0056b3;
}
</style>
