This is an extension created originally for going to next/previous spaces in C/Cpp files. But other useful commands have also been added for convenience.

Commands available:
NextSpace: Go to Next Space - Goes to the next space in the same line.

NextSpace: Go to Previous Space - Goes to the previous space in the same line.

NextSpace: Go to Start of Line - Goes to the start of the current line.

NextSpace: Go to End of Line - Goes to the end of the line.

NextSpace: Select till Next Empty Space - Selects from cursor till next empty space in the same line.

NextSpace: Select till Previous Empty Space - Selects from cursor till previous empty space in the same line.

NextSpace: Select till end of line - Selects from cursor till the end of the line.

NextSpace: Select till start of line - Selects from cursor till the beginning of the line.

NextSpace: Go To Function Start - Take the cursor to the start of a function.

NextSpace: Toggle Header/Source to other window - if the editor is split, open header file in the other split window to the right/left if the current file is a source file and vice versa.

NextSpace: Create Cpp Files - Opens a prompt, and creates cpp and header files with the provided name. Eg: if "test" is given in the prompt, then test.h and test.cpp files will be created. The files are placed in the project root.

NextSpace: Mark Cursor - Saves the position of the cursor position(To be coupled with selectMarked)

NextSpace: Select between Marks - if the cursor was previously marked, then text between the previously selected cursor position and the current cursor position will be selected.