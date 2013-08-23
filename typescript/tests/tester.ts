module testerModule {
    
    interface Result {
        passed :boolean;
        input :any;
        expected :any;
    }
    
    class SetOfUnitTests {
        // This class represents a set of related tests. It is essentially a helper class that determines 
        // and records the results of each unit test.
        
        public description :string = "";
        private results :Result[] = []; 
        
        constructor () {
            // pass
        }
        
        public expect( inputValue, expectedValue) {
            
            inputValue = JSON.stringify(inputValue);
            expectedValue = JSON.stringify(expectedValue);
            
            var result :Result = {
                passed: inputValue===expectedValue,
                input: inputValue,
                expected: expectedValue,
            };
            this.results.push(result);
        }
        
        public getResults() :string {
            
            var lines :string[] = [this.description];
            
            var i;
            var noFailures = true;
            for (i=0; i<this.results.length; i++) {
                
                var result = this.results[i]
                if (!result.passed) {
                    
                    var line = ['\tassertion', i+1, 'failed:', result.input, 'instead of', result.expected].join(" ");
                    lines.push(line);
                    noFailures = false;
                }
            }
            if (noFailures) {
                lines.push('\tall assertions passed.');
            }
            
            return lines.join('\n');
        }
        
    }
    
    export class Tester {
        
        private sets :SetOfUnitTests[] = [];
        
        constructor () {
            //pass;
        }
        
        public test (func) {
            // Func is a function which tests a certain set of functionality. Func takes a parameter, 
            // t, which is an instance of SetOfUnitTests.
            
            var t = new SetOfUnitTests();
            this.sets.push(t);
            
            func(t);
        }
        
        public displayResults() {
            
            var resultSets :string[] = [];
            var i;
            for (i=0; i<this.sets.length; i++) {
                resultSets.push(this.sets[i].getResults());
            }
            
            console.log(resultSets.join('\n\n'));
        }
    }
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    