import { AdminAttributeRepository } from '../repositories/AdminAttributeRepository.js';

export class AdminAttributeService {
  constructor() {
    this.repository = new AdminAttributeRepository();
  }

  /**
   * List all variant attributes with their values
   */
  async list() {
    try {
      const attributes = await this.repository.findAll();

      return {
        success: true,
        count: attributes.length,
        data: attributes
      };
    } catch (err) {
      const error = new Error(`Failed to fetch attributes: ${err.message}`);
      error.status = 500;
      throw error;
    }
  }

  /**
   * Create a new attribute
   * Required: name (unique), displayName
   */
  async create(data) {
    try {
      // Validate required fields
      if (!data.name || !data.displayName) {
        const error = new Error('Missing required fields: name, displayName');
        error.status = 400;
        throw error;
      }

      // Check if attribute name already exists
      const existing = await this.repository.findByName(data.name);
      if (existing) {
        const error = new Error('Attribute name already exists');
        error.status = 409;
        throw error;
      }

      const attribute = await this.repository.create({
        name: data.name,
        displayName: data.displayName
      });

      return {
        success: true,
        message: 'Attribute created successfully',
        data: attribute
      };
    } catch (err) {
      const error = err.status ? err : new Error(`Failed to create attribute: ${err.message}`);
      if (!error.status) error.status = 500;
      throw error;
    }
  }

  /**
   * List all values for an attribute
   */
  async listValues(attributeId) {
    try {
      // Check if attribute exists
      const attribute = await this.repository.findById(attributeId);
      if (!attribute) {
        const error = new Error('Attribute not found');
        error.status = 404;
        throw error;
      }

      const values = await this.repository.findValues(attributeId);

      return {
        success: true,
        attribute: {
          id: attribute.id,
          name: attribute.name,
          displayName: attribute.displayName
        },
        count: values.length,
        data: values
      };
    } catch (err) {
      const error = err.status ? err : new Error(`Failed to fetch attribute values: ${err.message}`);
      if (!error.status) error.status = 500;
      throw error;
    }
  }

  /**
   * Create a new attribute value
   * Required: value (unique per attribute), displayValue
   */
  async createValue(attributeId, data) {
    try {
      // Validate required fields
      if (!data.value || !data.displayValue) {
        const error = new Error('Missing required fields: value, displayValue');
        error.status = 400;
        throw error;
      }

      // Check if attribute exists
      const attribute = await this.repository.findById(attributeId);
      if (!attribute) {
        const error = new Error('Attribute not found');
        error.status = 404;
        throw error;
      }

      // Check if value already exists for this attribute
      const valueExists = await this.repository.valueExists(attributeId, data.value);
      if (valueExists) {
        const error = new Error(`Value "${data.value}" already exists for this attribute`);
        error.status = 409;
        throw error;
      }

      const value = await this.repository.createValue({
        attributeId,
        value: data.value,
        displayValue: data.displayValue
      });

      return {
        success: true,
        message: 'Attribute value created successfully',
        data: value
      };
    } catch (err) {
      const error = err.status ? err : new Error(`Failed to create attribute value: ${err.message}`);
      if (!error.status) error.status = 500;
      throw error;
    }
  }
}
