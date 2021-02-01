# Atlas Core
### Contributing guideline
## Overview
Hello contributor! Thank you for your interest in our system :)
You can check out the documentation in the wiki section of this repository. But, keep in mind, the information appears there with a significant delay and not all.
If you want to stay up to date with the latest news, read the source.
We describe all functions, components and classes at a high level and it will not be difficult for you to figure out the details.
## Contributing rules
We have some rules to follow when writing code. Here they are:
* Describe all functions, components, classes, variables, etc. using typescript and JSDocs.
* Description in JSDocs must contain a detailed description, type decorators, for example, @function or @interface. Also write authorship after the @author decorator. We encourage writing examples after the @example decorator.
* Add copyright to the beginning of the file and indicate your authorship. Here is the copyright pattern:
```
Copyright (c) $today.year. This code created and belongs to Pathfinder render manager project. 
Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
Project: $project.name
File last modified: $file.lastModified
All rights reserved.
```
* Name variables, functions and everything that you write as intuitively as possible so that there is no confusion and misunderstanding.
* Use CamelStyle in your code. 
    ```typescript
    const myVariable: string = "hello";
    
    function func(): void {
        // ...
    }
    
    class Cls {
        // ...
    }
    
    namespace NameSpace {
        // ...
    }
    ```
* Create JSDoc for each __function__, __method__, __class__, __interface__, __type__ and __class/interface fields__. 
* If possible, link to documentation in JSDocs using @see.
* In __functions__, __methods__, __classes__, __interfaces__ create ```@author``` tag and fill it with your name.
* Place ```Options``` interfaces into a __holder namespace__.
    ```typescript
    namespace Foo {
        /**
         * Options - interface for Foo options.
         * @interface
         * @author Danil Andreev
         */
        export interface Options {
            /**
             * bar - just example field name.
             */
            bar?: string;
            /**
             * baz - another example field name.
             */
            baz?: number; 
        }
    }
    
    /**
     * Foo - example class.
     * @class
     * @author Danil Andreev
     */
    class Foo { 
        /**
         * text - example text string.
         */
        protected static text: string = "Hello world";
    
        /**
         * constructor - creates an instance of Foo.
         * @constructor
         */
        public constructor(options?: Options) {
            // ...
        }
    
        /**
         * sayHello - method, designed to print text from input variable 
         * or static calss variable if input is not defined.
         * @method
         * @param text - Input text for printing.
         * @author Danil Andreev
         */
        public sayHello(text?: string): void {
            console.log(text || Foo.text);
        }
    }
    
    export default Foo;
    ```
* Specify types for all components.
    ```typescript
    const foo: string = "Hello darkness my old friend";
    
    function bar(input: string): string {
        return "Atlas: " + input; 
    }
    
    const baz = (input: string): string => "Atlas: " + input;
    ``` 
* Use __ES6__ _(ECMAScript 6)_ style in your code.
* Name your commits this way: 
  ```
    [module_name] (issue #issue_tag) Commit description.
  ```
* In the pull request, describe the changes in detail, write your credentials and add labels to the request. You can request a review from any of the reviewers.
  > Use PullRequest template on GitHub. Fill each field with correct info.
* We are happy to put you outside collaborators if you can help us.
* Smile more often, we have a very friendly team :)
## Contacts
You can send your questions to this email: danssg08@gmail.com
## Good luck
Thank you for reading this guide. Good luck!
