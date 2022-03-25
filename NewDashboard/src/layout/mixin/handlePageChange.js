// => 換頁相關變數與函式都放這
export default {
  data() {
    return {
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 30, 40]
    }
  },
  watch: {
    allData: function(e) {
      this.tableData = e
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.onSubmit()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.onSubmit()
    },
    handlePageChangeByClient(page) {
      this.currentPage = page
      this.tableData = this.allDataByClient.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  }
}
