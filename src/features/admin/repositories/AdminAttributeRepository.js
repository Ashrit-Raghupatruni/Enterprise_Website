import prisma from '../../../config/prisma.js';

export class AdminAttributeRepository {
  /**
   * Find all variant attributes with their values
   */
  async findAll() {
    return prisma.variantAttribute.findMany({
      select: {
        id: true,
        name: true,
        displayName: true,
        createdAt: true,
        updatedAt: true,
        values: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            createdAt: true
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Find attribute by ID with all values
   */
  async findById(id) {
    return prisma.variantAttribute.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        displayName: true,
        createdAt: true,
        updatedAt: true,
        values: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            createdAt: true
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  /**
   * Find attribute by name
   */
  async findByName(name) {
    return prisma.variantAttribute.findUnique({
      where: { name }
    });
  }

  /**
   * Create a new attribute
   */
  async create(data) {
    return prisma.variantAttribute.create({
      data,
      select: {
        id: true,
        name: true,
        displayName: true,
        createdAt: true,
        updatedAt: true,
        values: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            createdAt: true
          }
        }
      }
    });
  }

  /**
   * Get all values for an attribute
   */
  async findValues(attributeId) {
    return prisma.variantAttributeValue.findMany({
      where: { attributeId },
      select: {
        id: true,
        value: true,
        displayValue: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Create a new attribute value
   */
  async createValue(data) {
    return prisma.variantAttributeValue.create({
      data,
      select: {
        id: true,
        value: true,
        displayValue: true,
        attributeId: true,
        createdAt: true
      }
    });
  }

  /**
   * Check if attribute value already exists
   */
  async valueExists(attributeId, value) {
    return prisma.variantAttributeValue.findUnique({
      where: {
        attributeId_value: { attributeId, value }
      }
    });
  }
}
