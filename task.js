class Task {
    constructor(id, description, status) {
      this.id = id;
      this.description = description;
      this.status = status;
    }

        toString() {
            console.log(`id: ${this.id} description: ${this.description} status: ${this.status}`);
        }
}

export {Task}
