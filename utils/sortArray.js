 const sortArray = (array) => {
    return array.sort((a, b) => {

        const questionA = a.question.toUpperCase(); // ignore upper and lowercase
        const questionB = b.question.toUpperCase(); // ignore upper and lowercase
        
        if (questionA < questionB) {
          return -1;
        }
        if (questionA > questionB) {
          return 1;
        }

        return 0;
      });
}

module.exports = sortArray;