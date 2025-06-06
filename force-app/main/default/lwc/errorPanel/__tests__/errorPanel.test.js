import { createElement } from '@lwc/engine-dom';
import ErrorPanel from 'c/errorPanel';

describe('c-error-panel', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty.
    // Used when having to wait for asynchronous DOM updates.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('displays a default friendly message', () => {
        const MESSAGE = 'Error retrieving data';

        // Create initial element
        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });
        document.body.appendChild(element);

        const messageEl = element.shadowRoot.querySelector('h3');
        expect(messageEl.textContent).toBe(MESSAGE);
    });

    it('displays a custom friendly message', () => {
        const MESSAGE = 'Errors are bad';

        // Create initial element
        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });
        element.friendlyMessage = MESSAGE;
        document.body.appendChild(element);

        const messageEl = element.shadowRoot.querySelector('h3');
        expect(messageEl.textContent).toBe(MESSAGE);
    });

    it('displays no error details when no errors are passed as parameters', () => {
        // Create initial element
        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });
        document.body.appendChild(element);

        const anchorEl = element.shadowRoot.querySelector('a');
        expect(anchorEl).toBeNull();
    });

    it('displays error details when errors are passed as parameters', async () => {
        const ERROR_MESSAGES_INPUT = [
            { statusText: 'First bad error' },
            { statusText: 'Second bad error' }
        ];
        const ERROR_MESSAGES_OUTPUT = ['First bad error', 'Second bad error'];

        // Create initial element
        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });
        element.type = 'inlineMessage';
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        // Click link to show details
        element.shadowRoot.querySelector('a').click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const messageTexts = Array.from(
            element.shadowRoot.querySelectorAll('p')
        ).map((errorMessage) => (errorMessage = errorMessage.textContent));
        expect(messageTexts).toEqual(ERROR_MESSAGES_OUTPUT);
    });

    it('is accessible when inline message', async () => {
        const ERROR_MESSAGES_INPUT = [
            { statusText: 'First bad error' },
            { statusText: 'Second bad error' }
        ];

        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });

        element.type = 'inlineMessage';
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        // Click link to show details
        element.shadowRoot.querySelector('a').click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when no data illustration', async () => {
        const ERROR_MESSAGES_INPUT = [
            { statusText: 'First bad error' },
            { statusText: 'Second bad error' }
        ];

        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });

        element.type = 'noDataIllustration';
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});
